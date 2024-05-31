import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { ResponseHelper } from '../helpers/response.helper';
import { AppConstant } from '../app.constant';
import { FilterOperationDto } from '../dto/filter-operation.dto';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCodeEnum } from '../error-code.enum';
import { AUTH_COOKIE } from '../auth.constant';
import { Request as RequestType, Response } from 'express';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'fs';
import Papa from 'papaparse';

@Injectable()
export class CommonService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  /**
   * Get all information user from jwt token
   *
   * @param request
   * @returns
   */
  // getAccountInformationLogin(request: RequestType): User {
  //   // const token = request?.cookies[AUTH_COOKIE.TOKEN];
  //   // return this.jwtService.decode(token) as User;
  //   return this.jwtService.decode(request.headers['authorization'].split(' ')[1]) as User;
  // }

  getAccountInformationLogin(request: Request): User {
    return this.jwtService.decode(request.headers['authorization'].split(' ')[1]) as User;
  }

  /**
   * @param accountIdLogged
   * @param accountId
   */
  isProfileOwner(accountIdLogged: number, accountId: number) {
    if (accountIdLogged !== accountId) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getDataByPagination(paginationDto: PaginationDto, repository, callback?: (items) => void) {
    const { page, limit } = paginationDto;
    const offset = page == 0 ? 0 : (page - 1) * limit;
    const [items, total] = await repository.skip(offset).take(limit).getManyAndCount();

    let itemResponse = items;
    if (callback) {
      itemResponse = await callback(items);
    }

    return ResponseHelper.success({
      items: itemResponse,
      page,
      limit,
      total,
    });
  }

  async responseTagRelation(items) {
    return await Promise.all(
      items.map(async (item) => {
        const tagRelation = (await Promise.all(item.tagRelation.map((tag) => tag.tag))) ?? [];

        return {
          ...item,
          tagRelation,
        };
      }),
    );
  }

  /**
   * Create Query condition multiple value
   *
   * @param filterValue
   * @param tableName
   * @param columnName
   * @returns
   */
  createQueryMultipleValue(
    filterValue: string | number,
    tableName: string,
    columnName: string,
    type = AppConstant.TYPE_QUERY_STRING,
    subColumnName = '',
  ) {
    const listFilter = typeof filterValue === 'string' ? filterValue.split(',') : [filterValue];
    const parameters: Record<string, string | number> = {};
    const queryString: string[] = [];

    listFilter.forEach((filter, index) => {
      const paramName = `${columnName}_${index}`;
      parameters[paramName] = type === AppConstant.TYPE_QUERY_JSON ? filter.toString() : filter;
      queryString.push(`${this.switchTypeQueryOperation(tableName, columnName, subColumnName, type)} :${paramName}`);
    });

    return {
      queryString: queryString?.join(' OR '),
      parameters,
    };
  }

  /**
   * Switch string query sql condition by json or normal
   *
   * @param type
   * @param tableName
   * @param columnName
   * @param subColumnName
   * @returns
   */
  switchTypeQueryOperation(
    tableName: string,
    columnName: string,
    subColumnName = '',
    type = AppConstant.TYPE_QUERY_STRING,
  ) {
    const queryOperation =
      type === AppConstant.TYPE_QUERY_JSON ? `${columnName}->'${subColumnName}' @>` : `${tableName}.${columnName} =`;
    return queryOperation;
  }

  generateQueryBuilderFilter(
    filterValue: string | FilterOperationDto[],
    tableName: string,
    columnName: string,
    type = AppConstant.TYPE_QUERY_STRING,
    subColumnName = '',
  ) {
    const queryString: string[] = [];
    const parameters: string[] | number[] = [];

    if (typeof filterValue !== 'object') {
      this.handleNonObjectFilterValue(filterValue, tableName, columnName, parameters, queryString);
    } else {
      this.handleObjectFilterValue(filterValue, tableName, columnName, type, subColumnName, parameters, queryString);
    }

    return {
      queryString: queryString?.join(' AND '),
      parameters,
    };
  }

  handleNonObjectFilterValue(filterValue, tableName, columnName, parameters, queryString) {
    parameters[columnName] = `%${filterValue.toString().toLowerCase()}%`;
    if (typeof filterValue === 'number') {
      parameters[columnName] = filterValue;
      queryString.push(`${tableName}.${columnName} = :${columnName}`);
    } else {
      queryString.push(`LOWER(${tableName}.${columnName}) LIKE :${columnName}`);
    }
  }

  handleObjectFilterValue(filterValue, tableName, columnName, type, subColumnName, parameters, queryString) {
    filterValue.forEach((filter: FilterOperationDto, index) => {
      const queryStringOr: string[] = [];
      if (filter.value && filter.value?.toString().length > 0) {
        const paramName =
          type === AppConstant.TYPE_QUERY_JSON && filter.operation === AppConstant.OPERATION_EQ
            ? `${columnName}_${subColumnName}`
            : `${columnName}_${index}`;
        parameters[paramName] = filter.value;
        queryStringOr.push(
          `${this.switchOperationCondition(
            tableName,
            columnName,
            paramName,
            filter.operation ?? null,
            type,
            subColumnName,
          )}`,
        );

        if (type === AppConstant.TYPE_QUERY_JSON && filter.operation !== AppConstant.OPERATION_EQ) {
          this.handleSubFilterValue({
            filter: filter,
            tableName: tableName,
            columnName: columnName,
            type: type,
            subColumnName: subColumnName,
            paramName: paramName,
            index: index,
            parameters: parameters,
            queryStringOr: queryStringOr,
          });
        }

        queryString.push(`(${queryStringOr.join(' OR ')})`);
      }
    });
  }

  handleSubFilterValue(filterData: {
    filter: any;
    tableName: string;
    columnName: string;
    type: number;
    subColumnName: string;
    paramName: string;
    index: number;
    parameters: any;
    queryStringOr: string[];
  }) {
    const { filter, tableName, columnName, type, subColumnName, paramName, index, parameters, queryStringOr } =
      filterData;

    filter.value.forEach((value: any, valueIndex: number) => {
      const subParamName = `${paramName}_${index}_${valueIndex}`;
      parameters[subParamName] = value;
      queryStringOr.push(
        `${this.switchOperationCondition(
          tableName,
          columnName,
          subParamName,
          filter.operation ?? null,
          type,
          subColumnName,
        )}`,
      );
    });
  }
  switchOperationCondition(
    tableName: string,
    columnName: string,
    paramName: string,
    operation: string | null,
    type = AppConstant.TYPE_QUERY_STRING,
    subColumnName = '',
  ) {
    let queryOperation: string;
    switch (operation) {
      case AppConstant.OPERATION_NOT_IN:
        if (type === AppConstant.TYPE_QUERY_JSON) {
          queryOperation = `NOT ${columnName}->'${subColumnName}' @> :${paramName}::jsonb`;
        } else {
          queryOperation = `${tableName}.${columnName} NOT IN (:...${paramName}) OR ${tableName}.${columnName} IS NULL`;
        }
        break;
      case AppConstant.OPERATION_EQ:
        if (type === AppConstant.TYPE_QUERY_JSON) {
          queryOperation = `${columnName}->'${subColumnName}' @> :${paramName}`;
        } else {
          queryOperation = `${tableName}.${columnName} = :${paramName}`;
        }
        break;
      default:
        if (type === AppConstant.TYPE_QUERY_JSON) {
          queryOperation = `${columnName}->'${subColumnName}' @> :${paramName}::jsonb`;
        } else {
          queryOperation = `${tableName}.${columnName} IN (:...${paramName})`;
        }
        break;
    }

    return queryOperation;
  }

}

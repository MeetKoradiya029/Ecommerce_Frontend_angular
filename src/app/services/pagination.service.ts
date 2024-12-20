import { Injectable } from '@angular/core';
import { PAGE_SIZE } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }



  getPage(totalRecords: number, currentPage: number = 1) {
    console.log("total records >>>", typeof totalRecords);
    
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE)
    console.log("total pages >>", totalPages);
    
    if (totalPages !== undefined && totalPages !== null && totalPages !== 0) {
      // ensure current page isn't out of range
      if (currentPage < 1) {
        currentPage = 1;
      } else if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      let startPage: number, endPage: number;
      if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
          startPage = 1;
          endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
          startPage = totalPages - 9;
          endPage = totalPages;
        } else {
          startPage = currentPage - 5;
          endPage = currentPage + 4;
        }
      }

      // create an array of pages to ng-repeat in the pager control
      const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

      // return object with all pager properties required by the view
      return {
        currentPage,
        totalPages,
        startPage,
        endPage,
        pages
      };
    } else {
      return {}
    }
  }
}

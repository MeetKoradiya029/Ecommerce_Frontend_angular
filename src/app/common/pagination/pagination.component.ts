import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() pagination: any;
  @Input() currentPage!: number;

  @Output() getPageUpdate = new EventEmitter();

  getPage(pageNumber: number) {
    this.getPageUpdate.emit(pageNumber);
  }

}

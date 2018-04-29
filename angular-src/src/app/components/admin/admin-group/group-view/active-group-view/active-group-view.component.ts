import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-active-group-view',
  templateUrl: './active-group-view.component.html',
  styleUrls: ['./active-group-view.component.css', '../../../../../css/typography.css']
})
export class ActiveGroupViewComponent implements OnInit {

  @Input() groupInfo;
  loading: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupService } from '../../../../services/group.service';

@Component({
  selector: 'app-self-transactions',
  templateUrl: './self-transactions.component.html',
  styleUrls: ['./self-transactions.component.css', '../../../../css/typography.css']
})
export class SelfTransactionsComponent implements OnInit {

  loading: boolean = false;
  id: number = -1;
  number: number = -1;

  selfTransactionsData: Array<Object> = [];
  transactionsData: Array<Object> = [];
  promiseArray: Array<any> = [];

  constructor(private route: ActivatedRoute, private groupService: GroupService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });

    const user = JSON.parse(localStorage.getItem('user'));
    this.number = user.number;

    this.loading = true;
    this.groupService.getUserSubscribedGroups(this.number).subscribe(data => {
      if(data.status) {
        let tempData = data.message;
        for(let i=0; i<tempData.length; i++) {
          if(tempData[i]["group_id"] == this.id) {
            this.selfTransactionsData.push(tempData[i])
          }
        }
        for(let i=0; i<this.selfTransactionsData.length; i++) {
          this.promiseArray.push(this.getSelfTransactions(this.selfTransactionsData[i]));
        }
        Promise.all(this.promiseArray).then(response => {
        }).catch(err => {
          alert(err);
        })
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  getSelfTransactions(obj) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getSelfTransactions(obj.group_id, obj.token, obj.active).subscribe(data => {
        if(data.status) {
          for(let i=0; i<data.message.length;i++) {
            data.message[i]["name"] = obj["name"]
            this.transactionsData.push(data.message[i]);
          }
          resolve(true);
        } else {
          alert(data.message);
          reject(false);
        }
        this.loading = false;
      })
    })
  }

}

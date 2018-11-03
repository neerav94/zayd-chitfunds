import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css', '../../../css/typography.css']
})
export class AdminHomeComponent implements OnInit {

  loading: boolean = false;
  numUsers: number = 0;
  numGroups: number = 0;
  totalGroups: number = 0;
  paymentCollected: number = 0;
  totalChitValue: number = 0;
  aggregateAmount: string = '';
  aggregateChitValue: string = '';
  dailyCollection: string = '';
  weeklyCollection: string = '';

  dateModalFlag: boolean = false;
  dateModalFlag2: boolean = false;
  date: Date = new Date();
  startDate: any;
  endDate: any;

  constructor(private userService: UserService, private groupService: GroupService) { }

  ngOnInit() {
    document.getElementById("homeView").classList.add("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.remove("current");

    this.loading = true;
    this.userService.getAllUsers().subscribe(data => {
      if(data.status) {
        this.numUsers = data.message.length;
      } else {
        alert(data.message)
      }
      this.loading = false;
    })

    this.loading = true;
    this.groupService.getAllGroups().subscribe(data => {
      if(data.status) {
        let tempGroups = data.message;
        let groupsArray = [];
        for(let i=0; i<tempGroups.length; i++) {
          let diff = tempGroups[i].num_members - tempGroups[i].months
          if(diff >= 0) {
            groupsArray.push(tempGroups[i]);
          }
        }
        var promises = []
        for (var i = 0; i < groupsArray.length; i++) {
          promises.push(this.countGroups(groupsArray[i]))
          promises.push(this.aggregatePayment(groupsArray[i]))
        }
        this.loading = false;
        Promise.all(promises).then(response => {
          this.aggregateAmount = this.paymentCollected.toLocaleString('en-IN', {useGrouping:true})
          this.aggregateChitValue = this.totalChitValue.toLocaleString('en-IN', {useGrouping: true})
        }).catch(err => {
          console.log(err)
        })
      }
    })

    this.loading = true;
    this.groupService.getDailyCollection().subscribe(data => {
      if(data.status) {
        if(data.message) {
          this.dailyCollection = data.message.toLocaleString('en-IN', {useGrouping:true})
        } else {
          this.dailyCollection = '0';
        }
      } else {
        alert(data.message)
      }
      this.loading = false;
    })

    this.loading = true;
    this.groupService.getWeeklyCollection().subscribe(data => {
      if(data.status) {
        if(data.message) {
          this.weeklyCollection = data.message.toLocaleString('en-IN', {useGrouping:true})
        } else {
          this.weeklyCollection = '0';
        }
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  //  this.exportAsExcelFile(readyToExport, "download")

  }

  countGroups(obj) {
    this.totalGroups += 1;
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getGroupById(obj.grp_id).subscribe(data => {
        if(data.status) {
          let groupInfo = data.message
          if(groupInfo[0].start_date) {
            this.groupService.getAllSubscribers(groupInfo[0].grp_id).subscribe(data => {
              if(data.message.length >= groupInfo[0].num_members) {
                this.numGroups += 1;
                resolve({status: true});
              } else {
                reject({status: false});
              }
            })
          } else {
            reject({status: false});
          }
        } else {
          alert("Some error occurred. Please try again.")
          reject({status: false});
        }
        this.loading = false;
      }, err => {
        this.loading = false;
        alert("Some error occurred. Please try again.")
      })
    })
  }

  aggregatePayment(obj) {
    if(obj.startGroup < 2) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.groupService.paymentCollected(obj.grp_id).subscribe(data => {
          if (data.status) {
            if(data.message) {
              this.totalChitValue += obj["chit_value"]
              this.paymentCollected += parseInt(data.message);
              this.aggregateAmount = this.paymentCollected.toLocaleString('en-IN', {useGrouping:true})
              this.aggregateChitValue = this.totalChitValue.toLocaleString('en-IN', {useGrouping:true})
              resolve({status: true});
            }
          } else {
            alert(data.message);
            reject({status: false});
          }
          this.loading = false;
        })
      })
    }
  }

  // function called when start date is selected
  onCollectionStartDateSelect(startDate) {
    this.startDate = new Date(startDate.value).getTime()
    this.dateModalFlag = false;
    this.dateModalFlag2 = true;
    // this.submitDate();
  }

  // function called when end date is selected
  onCollectionEndDateSelect(endDate) {
    this.endDate = new Date(endDate.value).getTime()
    this.dateModalFlag2 = false;
    this.submitDate();
  }

  submitDate() {
    var dateObj = new Date(this.startDate);
    var month = dateObj.getMonth() + 1
    // month = month + 1
    var startDate = dateObj.getFullYear() + '.' + month + '.' + dateObj.getDate() + ' ' + '00:00:00'

    dateObj = new Date(this.endDate);
    month = dateObj.getMonth() + 1
    var endDate = dateObj.getFullYear() + '.' + month + '.' + dateObj.getDate() + ' ' + '23:59:59'
    var startDateString = new Date(startDate).getTime()
    var endDateString = new Date(endDate).getTime()

    this.loading = true;
    this.groupService.getCollectionReportData(startDateString, endDateString).subscribe(data => {
      if(data.status) {
        let tempCollectionData = data.message;
        tempCollectionData.sort(function(a,b) {
          if ( a.payment_date < b.payment_date )
              return -1;
          if ( a.payment_date > b.payment_date )
              return 1;
          return 0;
        });
        let collectionData = []
        for(let i in tempCollectionData) {
          let obj = {};
          obj["Group Name"] = tempCollectionData[i]["group_name"]
          obj["Auction Day"] = tempCollectionData[i]["auction_day"]
          obj["Chit Value"] = tempCollectionData[i]["chit_value"]
          obj["Token"] = tempCollectionData[i]["token"]
          obj["Name"] = tempCollectionData[i]["name"]
          obj["Number"] = tempCollectionData[i]["number"]
          obj["Amount"] = tempCollectionData[i]["amount"]
          obj["Payment Mode"] = tempCollectionData[i]["payment_mode"]
          var dateIST = new Date(tempCollectionData[i]["payment_date"])
          // dateIST.setHours(dateIST.getHours() + 5); 
          // dateIST.setMinutes(dateIST.getMinutes() + 30);
          obj["Payment Date"] = dateIST.getDate() + "/" + (dateIST.getMonth() + 1) + "/" + dateIST.getFullYear() + " " + dateIST.getHours() + ":" + dateIST.getMinutes()
          obj["Comment"] = tempCollectionData[i]["payment_comment"]
          collectionData.push(obj);
        }
        this.exportAsExcelFile(collectionData, "collectionReport.xlsx")
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  downloadUserReport() {
    this.loading = true;
    this.groupService.getUserDataReport().subscribe(data => {
      if(data.status) {
        let tempUserReport = data.message;
        let userReport = [];
        for(let i in tempUserReport) {
          let obj = {};
          obj["Name"] = tempUserReport[i]["name"]
          obj["Number"] = tempUserReport[i]["number"]
          obj["Email"] = tempUserReport[i]["email"]
          obj["DOB"] = tempUserReport[i]["dob"]
          obj["Age"] = tempUserReport[i]["age"]
          obj["Gender"] = tempUserReport[i]["gender"]
          obj["Residential Address"] = tempUserReport[i]["residential_address"]
          obj["Other Number"] = tempUserReport[i]["other_number"]
          obj["Father/Husband Name"] = tempUserReport[i]["father_husband_name"]
          obj["Aadhar No."] = tempUserReport[i]["aadhar"]
          obj["PAN Card No."] = tempUserReport[i]["pan"]
          obj["Income"] = tempUserReport[i]["income"]
          obj["Nominee"] = tempUserReport[i]["nominee"]
          obj["Dependents"] = tempUserReport[i]["dependents"]
          obj["Occupation"] = tempUserReport[i]["occupation"]
          obj["Business Name"] = tempUserReport[i]["business_name"]
          obj["Office Address"] = tempUserReport[i]["office_address"]
          obj["First Reference"] = tempUserReport[i]["first_reference"]
          obj["Second Reference"] = tempUserReport[i]["second_reference"]
          userReport.push(obj);
        }
        this.exportAsExcelFile(userReport, "userReport.xlsx")
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  downloadSubstitutedSubscribersReport() {
    this.loading = true;
    this.groupService.getSubstitutedSubscribersReport().subscribe(data => {
      if(data.status) {
        let tempData = data.message
        let userList = [];
        for(let i in tempData) {
          let obj = {};
          obj["Group Name"] = tempData[i]["group_name"]
          obj["Token"] = tempData[i]["token"]
          obj["Subscriber Name"] = tempData[i]["name"]
          obj["Subscriber Number"] = tempData[i]["number"]
          userList.push(obj)
        }
        this.exportAsExcelFile(userList, "substitutedSubscribersReport.xlsx")
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  downloadGroupReport() {
    this.loading = true;
    this.groupService.getAllGroups().subscribe(data => {
      if(data.status) {
        let tempAllGroups = data.message;
        let groupsReport = [];
        for(let i in tempAllGroups) {
          let obj = {};
          obj["Group Name"] = tempAllGroups[i]["grp_name"]
          obj["Chit Value"] = tempAllGroups[i]["chit_value"]
          obj["Members/Months"] = tempAllGroups[i]["num_members"]
          obj["Months Over"] = tempAllGroups[i]["months"]
          obj["Months Remaining"] = tempAllGroups[i]["num_members"] - tempAllGroups[i]["months"]
          obj["Auction Day"] = tempAllGroups[i]["auction_day"]
          obj["Amount Collected"] = tempAllGroups[i]["amount"]
          let totalAmount = tempAllGroups[i]["chit_value"] * tempAllGroups[i]["months"]
          if(totalAmount == tempAllGroups[i]["amount"]) {
            obj["Advance Balance"] = 0
            obj["Balance Due"] = 0
          } else if(totalAmount < tempAllGroups[i]["amount"]) {
            obj["Advance Balance"] = tempAllGroups[i]["amount"] - totalAmount
            obj["Balance Due"] = 0
          } else {
            obj["Advance Balance"] = 0
            obj["Balance Due"] = totalAmount - tempAllGroups[i]["amount"]
          }
          obj["Start Date and Draw Time"] = tempAllGroups[i]["startDay"]
          groupsReport.push(obj);
        }
        this.exportAsExcelFile(groupsReport, "groupsReport.xlsx")
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(json);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
    XLSX.writeFile(workBook, excelFileName); // initiate a file download in browser
    this.loading = false;
  }

  selectDate() {
    this.dateModalFlag = true;
  }

  closeDateModal() {
    this.dateModalFlag = false;
  }

}

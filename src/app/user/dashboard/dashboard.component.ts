import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  data: any[] = [];
  users: any;
  events: any;
  offers: any;
  scratchCards: any;
  isChecked: boolean = false;


  handleCheckboxChange(row: any) {

    if (row.isActive == false) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this user!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`/admin/activeUser/${row.id}`, null).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getUsersData();
            }
          })
        } else {
          this.getUsersData();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to deactive this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`/admin/deactivateUser/${row.id}`, null).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getUsersData();
            }
          })
        } else {
          this.getUsersData();
        }
      });

    }
  }

  // handleCheckboxChange(row: any) {
  //   //this.isChecked = !this.isChecked;
  //   if (row.isActive == false) {
  //     this.service.postAPI(`/admin/activeUser/${row.id}`, null).subscribe({
  //       next: resp => {
  //         console.log(resp)
  //         this.toastr.success(resp.message)
  //         this.getUsersData();
  //       }
  //     })
  //   } else {
  //     this.service.postAPI(`/admin/deactivateUser/${row.id}`, null).subscribe({
  //       next: resp => {
  //         console.log(resp)
  //         this.toastr.success(resp.message)
  //         this.getUsersData();
  //       }
  //     })
  //   }
  // }

  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsersData();
    this.getData();
  }

  getData() {
    this.service.getApi('/admin/home').subscribe({
      next: resp => {
        this.users = resp.users;
        this.events = resp.events;
        this.offers = resp.offers;
        this.scratchCards = resp.scratchCards;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }


  getUsersData() {
    this.service.getApi('/admin/users').subscribe({
      next: resp => {
        this.data = resp.users;
        //this.isChecked = resp.users?.isActive
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  deleteField(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      confirmButtonColor: "#b92525",
    })
      .then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', id);
          this.service.gdeleteApi(`/admin/user/${id}`).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getUsersData();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
  }

  userImg: any;

  showImg(url: any) {
    this.userImg = url;
  }
  //Download csv file
  // downloadCSV(): void {
  //   // Selecting only specific columns
  //   const selectedColumnsData = this.data.map(item => ({
  //     name: item.full_name,
  //     phone_no: item.phone_no,
  //     email: item.email,
  //     gender: item.gender
  //   }));

  //   // Convert selected columns to CSV format
  //   const csvContent = this.convertArrayOfObjectsToCSV(selectedColumnsData);

  //   // Create a Blob containing the CSV data
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  //   // Trigger download
  //   const link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob);
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", "events_data.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }

  // // Function to convert array of objects to CSV format
  // convertArrayOfObjectsToCSV(data: any[]): string {
  //   const header = Object.keys(data[0]).join(',');
  //   const csv = [header];
  //   data.forEach((row) => {
  //     const values = Object.values(row).map((val) => `"${val}"`);
  //     csv.push(values.join(','));
  //   });
  //   return csv.join('\n');
  // }








  // Function to download selected columns as Excel file

  downloadExcel(): void {
    // Selecting only specific columns
    const selectedColumnsData = this.data.map(item => ({
      name: item.full_name,
      phone_no: item.phone_no,
      email: item.email,
      gender: item.gender
    }));

    // Create a new workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Convert selected columns data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedColumnsData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events Data');

    // Write the workbook to a binary string
    const excelBuffer: ArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert the binary string to a Blob
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Trigger download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(data);
      link.setAttribute("href", url);
      link.setAttribute("download", "events_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


}

import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DataService} from "../../services/dataService.service";
import {NgForm} from "@angular/forms";
import {Config} from "../../services/config.service";
import {Router, ActivatedRoute, Route} from "@angular/router";
import {DialogService} from "ng2-bootstrap-modal";
import {ToastsManager} from "ng2-toastr";
import {ConfirmComponent} from "../confirmComponent/confirm.component";

declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  @ViewChild('f') groupForm: NgForm;


  constructor(private dataService: DataService, private config: Config, private router: Router,
              private route: ActivatedRoute, public toastr: ToastsManager, vcr: ViewContainerRef, private dialogService: DialogService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.dataService.getAllCategories().subscribe((res) => {
      if (res['count'] > 0) {
        this.categories = res['data'];
      }
    }, (err) => {
      if (err.status === 0) {
        this.toastr.error("Server is Down.")
      } else {
        this.toastr.error(err.message);
      }
    })
  }

  createCat() {
    this.router.navigate(['create'], {relativeTo: this.route});
  }

  editCat(category) {
    this.router.navigate(['update/', category._id], {relativeTo: this.route});
  }

  deleteCat(category) {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: '',
      message: 'Are you sure to delete this category?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.dataService.deleteSolution(category['_id']).subscribe((res) => {
          this.getAllCategories();
          this.toastr.success("Category deleted successfully.", null, {toastLife: 3000});
        }, (err) => {
          if (err.status === 0) {
            this.toastr.error("Server is Down.")
          } else {
            this.toastr.error(err.message);
          }
        });
      }
    });
  }
}

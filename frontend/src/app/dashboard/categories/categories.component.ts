import { Component, OnInit } from '@angular/core';
import Category from 'src/app/model/Category';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  newCategory = undefined;
  currentCategory: Category;
  categories: Category[] = [];
  loading: boolean = true;
  apiURL = environment.apiURL;

  constructor(
    private apiService: APIService,
    private globalService: GlobalService
  ) {
    document.title = 'Manage Categories - Cards & Dice';
  }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }

  manageCategory(category: Category) {
    this.currentCategory = category;
    this.newCategory = undefined;
    window.scrollTo(0, 0);
  }

  changeCategoryImage(event, category: Category) {
    let file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.globalService.userToken.subscribe((newToken) => {
        if (newToken !== null) {
          this.apiService
            .uploadNewCategoryImage(formData, newToken, category.id)
            .subscribe((data: Category) => {
              const index = this.categories.indexOf(category);
              this.categories[index] = { ...this.categories[index], ...data };
              alert('Successfully changed to the new Image.');
            });
        }
      });
    }
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.newCategory.image = file;
    }
  }

  hideCategory() {
    this.currentCategory = undefined;
    this.newCategory = undefined;
  }

  uploadNewCategoryToServer() {
    const formData = new FormData();
    formData.append('title', this.newCategory.title);
    formData.append('image', this.newCategory.image);

    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .uploadCategory(formData, newToken)
          .subscribe((data: Category) => {
            this.categories.push(data);
            alert('Successfully Uploaded new Category.');
            setTimeout(() => {
              this.hideCategory();
            }, 2000);
          });
      }
    });
  }

  updateCurrentCategory() {
    const formData = this.currentCategory;

    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .updateCategory(formData, this.currentCategory.id, newToken)
          .subscribe((data: any) => {
            const index = this.categories.indexOf(this.currentCategory);
            this.categories[index] = { ...this.categories[index], ...data };
            alert('Successfully Updated this Category.');
            setTimeout(() => {
              this.hideCategory();
            }, 2000);
          });
      }
    });
  }

  deleteCurrentCategory(category: Category) {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.deleteCategory(category.id, newToken).subscribe(() => {
          const index = this.categories.indexOf(this.currentCategory);
          this.categories.splice(index, 1);
          alert('Successfully Deleted this Category.');
          setTimeout(() => {
            this.hideCategory();
          }, 2000);
        });
      }
    });
  }

  addCategory() {
    this.currentCategory = undefined;
    this.newCategory = {
      title: '',
      slug: '',
      image: File,
    };
  }
}

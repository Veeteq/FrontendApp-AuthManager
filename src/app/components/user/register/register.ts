import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/_service/auth.service';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, AfterViewInit {
  // Reference to the username input element in the template
  @ViewChild('firstnameInput') firstnameInput!: ElementRef;
  
  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      // Password must be at least 6 characters long
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit() {
    // Set focus to the firstname input automatically
    this.firstnameInput.nativeElement.focus();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.form.value)
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate(['/user/login'], { queryParams: { registered: true }});
      },
      error: err => {
        this.error = err.error.message;
        this.loading = false;
      }
  });
  }

}

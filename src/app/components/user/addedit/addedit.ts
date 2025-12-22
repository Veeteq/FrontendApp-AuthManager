import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@app/_service/alert.service';
import { AuthService } from '@app/_service/auth.service';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-addedit',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './addedit.html',
  styleUrl: './addedit.css',
})
export class AddEdit implements OnInit{
  form!: FormGroup;
  id?: number | null;
  submitted = false;

  title = signal<string>('Add User');
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      // Password must be at least 6 characters long, only required for new users
      password: ['', [Validators.minLength(6), ...(this.id ? [Validators.required] : [])]],
    });

    if (this.id) {
      this.title.set('Edit User');
      this.loading.set(true);
      this.authService.getById(this.id)
      .pipe(first())
      .subscribe((user) => {
        this.form.patchValue(user);
        this.loading.set(false);
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) return;    

    this.submitting.set(true);

    const action = this.id
      ? this.authService.update(this.id, this.form.value)
      : this.authService.register(this.form.value);

    action
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('User saved', true);
          this.router.navigateByUrl('/users');

        },
        error: (err) => {
          this.alertService.error(err.error.message);
          this.submitting.set(false);
        }
      });
  }
  
}

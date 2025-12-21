import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-transpose-control',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './transpose-control.html',
  styleUrl: './transpose-control.scss',
})
export class TransposeControl {
  @Input() value: number = 0;
  @Input() min: number = -6;
  @Input() max: number = 6;
  @Output() onChange = new EventEmitter<number>();

  public themeService = inject(ThemeService);

  handleChange(increment: number) {
    const newValue = Math.max(this.min, Math.min(this.max, this.value + increment));
    this.onChange.emit(newValue);
  }
}

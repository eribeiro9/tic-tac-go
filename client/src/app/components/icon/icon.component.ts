import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarkType } from '../../enums/mark-type.enum';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {

  @Input() icon: MarkType = MarkType.Blank;
  @Input() color: string = '';

  MarkType = MarkType;

}

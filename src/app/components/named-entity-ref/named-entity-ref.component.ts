import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { NamedEntity, NamedEntityRefData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-named-entity-ref',
  templateUrl: './named-entity-ref.component.html',
  styleUrls: ['./named-entity-ref.component.scss'],
})
@register
export class NamedEntityRefComponent {
  @Input() data: NamedEntityRefData;

  entity: NamedEntity;

  public highlighted$ = of(true); // TODO: connect to highlight service
  public opened = false;

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }

}

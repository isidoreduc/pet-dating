import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { MemberEditComponent } from './../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class NotifyUnsaved implements CanDeactivate<MemberEditComponent> {
  canDeactivate(
    component: MemberEditComponent): boolean {
    return component.editForm.dirty ?
      confirm('Positive you want to navigate away? Unsaved changes will be lost') : true;
  }

}

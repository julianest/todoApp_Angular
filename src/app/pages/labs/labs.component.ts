import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  title = 'todoapp';
  welcome = 'hola';
  tasks = signal([
    'Instalar angular cli',
    'Crear proyecto',
    'crear component'
  ]);
  name = 'julian';
  nameSignal = signal('julian');
  age = 31;
  disabledButton = false;
  img = 'https://w3Schools.com/howto/img_avatar.png';
  person = {
    name: 'julian',
    age: 31,
    avatar: 'https://w3Schools.com/howto/img_avatar.png'
  }
  personSignal = signal({
    name: 'julian',
    age: 31,
    avatar: 'https://w3Schools.com/howto/img_avatar.png'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50,{
    nonNullable: true,
  });
  nameCtrl = new FormControl('nombre',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor(){
    this.colorCtrl.valueChanges.subscribe(value =>
      console.log(value)
    )
  }

  clickHandler(){
    alert('hola')
  }
  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement
    console.log(input)
    const newvalue = input.value;
    this.nameSignal.set(newvalue);

  }
  keydownHandler(ev: KeyboardEvent) {
    const input = ev.target as HTMLInputElement
    console.log(input.value)
    const newvalue = input.value;
    this.nameSignal.set(newvalue);
  }

  changeName(ev: Event) {
    const input = ev.target as HTMLInputElement
    const newvalue = input.value;
    this.personSignal.update(
      prevState =>{
        return {
          ...prevState,
          name: newvalue
        }
      });
  }



}

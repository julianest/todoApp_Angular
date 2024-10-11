import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  // tasks = signal<Task[]>([
  //   {
  //     id: Date.now(),
  //     title: 'Crear Proyecto',
  //     completed: false
  //   },
  //   {
  //     id: Date.now(),
  //     title: 'Instalar angular cli',
  //     completed: false
  //   },
  //   {
  //     id: Date.now(),
  //     title: 'Crear proyecto',
  //     completed: false
  //   }
  // ]);

  newTaskCtrl = new FormControl('',{ //si tiene algun valor por defecto
    nonNullable: true, //no puede tener valores nulos
    validators: [
      Validators.required
    ]
  });


  // changeHandler(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   const newTask = input.value;
  //   this.addTask(newTask);

  // }

  //con formulario reactivo cambiaria: ya que el valor quedaria en la variable newTaskCtrl y no es necesario capturarlo como antes.
  changeHandler(){
    if(this.newTaskCtrl.valid ){
      const value = this.newTaskCtrl.value.trim();
      value !== '' && this.addTask(value);
      this.newTaskCtrl.setValue('');
    }

  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title: title,
      completed:false
    };
    this.tasks.update((task)=>[...task, newTask]);
  }

  deleteTask(index:number){
    this.tasks.update((tasks)=> tasks.filter((task, position)=> position !== index))
  }

  checkedHandler(i:number){
    this.tasks.update((tasks) =>
      tasks.map((task, position)=>{
        position === i && (task.completed = !task.completed);
        return task;
        })
      );
  }

  // updateTaskEditing(i: number){
  //   console.log(i);
  //   this.tasks.update((tasks) =>
  //     tasks.map((task, position)=>{
  //       position === i && (task.editing = !task.editing);
  //       return task;
  //       })
  //     );
  // }

  updateTaskEditing(i: number){
    this.tasks.update(prevState =>{
      return prevState.map((task, position) => {
        if( position === i){
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    });
  }

  updateTaskText(i: number, ev: Event){
    const input = ev.target as HTMLInputElement;
    const newValueText = input.value.trim();
    this.tasks.update(prevState =>{
      return prevState.map((task, position) => {
        if( position === i){
          return {
            ...task,
            title: newValueText,
            editing: false,
          }
        }
        return task;
      })
    });
  }


  //Computed statements son como estados que se afectan de acuerdo a otros estados son como signals dentro
  //de un computed, es decir crea un nuevo estado apartir de los estados que yo este vigilando en la funcion
  //es decir un cambio en filter o en tasks me afectaria.
  filter = signal<'all' | 'pending' | 'completed'> ('all'); //con <> lo tipamos y le decimos solo va a recibir estos estados
  taskByFilter = computed(()=>{ //es decir todo esto que es una señal que se deriva de otras signals
    const filter = this.filter();
    const tasks = this.tasks();
    if( filter === 'pending'){
      return tasks.filter(task => !task.completed);
    }
    if( filter === 'completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  changeFilter(filter: 'all' | 'pending' | 'completed'){ //y aqui lo tipamos para decirle este string solo va a recibir estos
      this.filter.set(filter);
  }


  //Se supone que con el constructor al crearse o ejecutarse una clase el corre todo de forma inicial
  //segun la clase el tenia que eliminar todo y no mostrar nada caundo uno actualizaba la pagina, en este
  //caso a mi si me seguia guardando es algo que toca revisar, pero para este ejemplo vamos a hacer con inyecciones
  //la cual lo que hace es darle orden al effect en este caso utilizamos inyector.
  // constructor(){ //este es parecido a un useEffect, este no retorna nada a difierencia del computed, es como un tracking
  //   effect(()=>{
  //     const tasks = this.tasks();
  //     console.log(tasks);
  //     localStorage.setItem('tasks', JSON.stringify(tasks))
  //   });
  // }

  // ngOnInit() {
  //   const storage = localStorage.getItem('tasks');
  //   if(storage){
  //     const tasks = JSON.parse(storage); //aqui lo volvemos nuevamente a tipo objeto.
  //     this.tasks.set(tasks);
  //   }
  // }

  injector = inject(Injector)


  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage); //aqui lo volvemos nuevamente a tipo objeto.
      this.tasks.set(tasks);
    }
    this.trackTasksFromStorage();
  }

  trackTasksFromStorage(){
    effect(()=>{
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks))
      },{injector:this.injector} ); //esto solo se haria si el effect no estuviera en otro lugar que no fuera el constructor
  }

}

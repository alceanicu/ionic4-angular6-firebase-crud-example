import {Component, OnInit} from '@angular/core';
import * as firebase from 'Firebase';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormArray} from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  quizForm: FormGroup;

  constructor(private route: ActivatedRoute, public router: Router, private formBuilder: FormBuilder) {
    this.quizForm = this.formBuilder.group({
      id: '',
      quiz: this.formBuilder.array([
        this.initQuiz(),
      ]),
      answers: this.formBuilder.array([
        this.initAnswer(),
      ])
    });
  }

  ngOnInit() {
  }

  initQuiz() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      language: ['none', Validators.required]
    });
  }

  initAnswer() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      language: ['none', Validators.required],
      correct: [false, Validators.required]
    });
  }

  saveQuiz() {
    this.writeNewQuiz();
    // const newInfo = this.ref.push();
    // const obj = this.infoForm.value;
    // obj.random = Math.random();
    // newInfo.set(obj);
    // this.router.navigate(['/detail/' + newInfo.key]);
  }

  writeNewQuiz() {
    // increment the counter
    firebase.database().ref('xxx/').child('counter').transaction((currentValue) => {
      return (currentValue || 0) + 1;
    }, (error, committed, snapshot) => {
      if (error) {
        console.log(error);
      } else if (committed) {
        const newQuiz = {
          'id': snapshot.val(),
          'quiz': [
            {text: '...', language: 'none'},
            {text: 'PHP ... ', language: 'PHP'}
          ],
          'answers': [
            {text: 'correct', language: 'none', correct: true},
            {text: 'fals', language: 'PHP', correct: false},
            {text: 'fals', language: 'PHP', correct: false},
            {text: 'fals', language: 'PHP', correct: false}
          ],
        };
        this.addQuiz('xxx/records/', newQuiz).then(function () {
          console.log('Inserted with succeeded');
        }).catch((err) => {
          console.log('Inserted failed');
          console.error(err);
        });
      }
    });
  }

  delQuizRow(index: number): void {
    const arrayControl = <FormArray>this.quizForm.controls['quiz'];
    arrayControl.removeAt(index);
  }

  addQuizRow(): void {
    const arrayControl = <FormArray>this.quizForm.controls['quiz'];
    arrayControl.push(this.initQuiz());
  }

  // creates new incremental record
  addQuiz(path, obj) {
    const messageListRef = firebase.database().ref(path);
    const newMessageRef = messageListRef.push();
    return newMessageRef.set(obj);
  }

  // writeNewPost() {
  // const it = this.quizForm.value;
  // const quizData = {
  //   q: [
  //     {t: '...', l: 'none'}
  //   ],
  //   a: [
  //     {t: 'A', c: true, l: 'PHP'},
  //     {t: 'B', c: false},
  //     {t: 'C', c: false},
  //     {t: 'D', c: false}
  //   ],
  //   r: Math.random()
  // };
  //
  // // Get a key for a new Post.
  // const key = firebase.database().ref().child('phpData').push().key;
  //
  // // Write the new post's data simultaneously in the posts list and the user's post list.
  // const updates = {};
  // updates['/phpData/' + key] = quizData;
  // // updates['/phpData/answers/' + key] = [
  // //   {text: 'A corect', correct: true},
  // //   {text: 'B', correct: false},
  // //   {text: 'C', correct: false},
  // //   {text: 'D', correct: false}
  // // ];
  //
  // // updates['/xxx'] = {
  // //   "counter": 1,
  // //   "records": {
  // //     "rec1": "record #1"
  // //   }
  // // };
  // return firebase.database().ref().update(updates);
  // }

}

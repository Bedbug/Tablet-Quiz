/**
 * AngularJS module to process a form.
 */
var app = angular.module('myApp', ['ajoslin.promise-tracker','ngSanitize'])
  .controller('help', function ($scope, $http, $log, promiseTracker, $timeout, $sce) {
    $scope.subjectListOptions = {
      'bug': 'Report a Bug',
      'account': 'Account Problems',
      'mobile': 'Mobile',
      'user': 'Report a Malicious User',
      'other': 'Other'
    };


	 // Inititate the promise tracker to track form submissions.
    $scope.progress = promiseTracker();
	$scope.endScreen = 0;
	$scope.QuizActive = 0;
	$scope.terms = false;
	$scope.bg = "img/start0.jpg";

	
	
	$scope.startApp = function() {
		 $scope.QuizActive = 1;
		  $scope.bg = "img/bgform.jpg";
	}
	
	$scope.skip = function () {
		$scope.QuizActive = 2;
		
			  $scope.email = "";
			  $scope.name = "";
			  $scope.lastname = "";
			  $scope.phone = "";
			  $scope.terms = false;
			  $scope.start();
	}
	
	//$timeout(function() {
			//alert("Hello! I am an alert box!!");
	//	   $scope.QuizActive = 1;
	//	   $scope.bg = "img/bg.jpg";
	//	}, 3000); 
		
   






    // Form submit handler.
    $scope.submit = function(form) {
      // Trigger validation flag.
      $scope.submitted = true;
	
	$scope.messages = 'Sending Request!';
      // If form is invalid, return and let AngularJS show validation errors.
      //if (form.$invalid) {
      //  return;
      //}

      var req = {
	 method: 'POST',
	 url: '../php/register.php ',
		 headers: {
	   		"Content-Type": "application/json"
		 },
		 	data: { email: $scope.email, name: $scope.name, phone: $scope.phone, lastname: $scope.lastname }
		}

      $http(req).
	  success(function(data, status, headers, config) {
			  $scope.QuizActive = 2;
			  $scope.email = "";
			  $scope.name = "";
			  $scope.lastname = "";
			  $scope.phone = "";
			  $scope.terms = false;
			  $scope.start();

		 }).
 		error(function(data, status, headers, config) {
			  $scope.QuizActive = 2;
 		 });
      
    };
  });


app.directive('quiz', function(quizFactory, $window) {
	return {
		restrict: 'AE',
		
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {


			scope.start = function() {
			
				scope.id = Math.floor((Math.random() * 1) );
				scope.questionsAnswered = 0;
				scope.alreadyAnswered = [];
				scope.quizOver = false;
				scope.mesg1 = false;
				scope.mesg2 = false;
				scope.mesg3 = false;
				scope.inProgress = true;
				scope.getQuestion();
			};


			scope.reload = function(){
				console.log("next");
				if(scope.endScreen<1)
				{
					scope.bg = "img/end"+scope.endScreen+".jpg";
					scope.endScreen ++;
				}
				else
					$window.location.reload();
			}

			scope.reset = function() {

				scope.inProgress = false;
				scope.score = 0;
				scope.questionsAnswered = 0;
				scope.alreadyAnswered = [];
				scope.mesg1 = false;
				scope.mesg2 = false;
				scope.mesg3 = false;
				scope.bg = "img/start0.jpg"
				
			}

			scope.getQuestion = function() {
				
				
				var q = quizFactory.getQuestion(scope.id, scope.questionsAnswered);
				
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
					scope.bg = q.image;
				} else {
					scope.quizOver = true;
					if(scope.score <= 3) {
						scope.bg = "img/message1.jpg";
					} else if(scope.score <= 6) {
						scope.bg = "img/message2.jpg";;
					} else  {
						scope.bg = "img/message3.jpg";;
					}
					
					
				}
			};

			scope.checkAnswer = function(ans) {
				//if(!$('input[name=answer]:checked').length) return;

				//var ans = $('input[name=answer]:checked').val();

				if(ans == 0) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
				scope.nextQuestion();
				scope.questionsAnswered++;
				//scope.answerMode = false;
			};

			scope.nextQuestion = function() {
				//scope.id++;
				scope.id = Math.floor((Math.random() * 20) );
				//console.log("Scope Id: "+scope.id);
				
				for ( var q in scope.alreadyAnswered) {
					//console.log("Already Answered: "+scope.alreadyAnswered[q]);
					if(scope.id == scope.alreadyAnswered[q]){
						//console.log("Same Question! Finding An Other One.");
						scope.nextQuestion();
						break;
					}
				} 
				
				scope.alreadyAnswered.push(scope.id);
				//console.log("Pushing..."+scope.id);
				
				scope.getQuestion();
			}

			scope.reset();
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
		{
			question: "Χρησιμοποιώ το tablet μου για <span>να βλέπω ταινίες.</span>",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/1.jpg"
		},
		{
			question: "Χρησιμοποιώ το tablet για να <span>ενημερώνομαι για το lifestyle.</span>",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/2.jpg"
		}
		,{
			question: "Με το tablet ακούω κάθε στιγμή της ημέρας <span>την αγαπημένη μου μουσική.</span>",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/3.jpg"
		}
		,{
			question: "Με το tablet μου <span>σερφάρω στο Internet</span> όλη μέρα κάθε μέρα, όπου κι αν βρίσκομαι!",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/4.jpg"
		}
		,{
			question: "Έχω το tablet πάντα μαζί μου για να <span>διαχειρίζομαι τα θέματα της δουλειάς</span> μου όταν βρίσκομαι εκτός του επαγγελματικού χώρου.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/5.jpg"
		}
		,{
			question: "Μπορώ να <span>κάνω καταδύσεις</span> με το tablet μου.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/6.jpg"
		}
		,{
			question: "Με το tablet μου <span>τρελαίνομαι να κάνω video κλήσεις.</span>",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/7.jpg"
		}
		,{
			question: "Με το tablet <span>διαχειρίζομαι τους λογαριασμούς μου</span> στα social media.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/4.jpg"
		}
		,{
			question: "Χρησιμοποιώ το tablet μου για να <span>“τσατάρω” με τους φίλους μου</span> όπου κι αν βρίσκομαι.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/2.jpg"
		}
		,{
			question: "Η διάσταση της οθόνης ενός tablet μετριέται σε inches.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Η μεγιστοποίηση της πιστότητας σε μία κάμερα μετριέται σε pixel.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Ένα tablet ζυγίζει κάτω από 500 γραμμάρια.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Όταν κοιτάω την οθόνη του tablet, τα βλέπω όλα ασπρόμαυρα.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Τα tablets λειτουργούν με μπαταρία.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Ο επεξεργαστής σε ένα tablet μετράει την ταχύτητα.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Η μνήμη του tablet μετριέται σε RAM.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/bg.jpg"
		}
		,{
			question: "Με το tablet <span>βγάζω φωτογραφίες</span> στις καλοκαιρινές μου διακοπές.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/14.jpg"
		}
		,{
			question: "Με το tablet <span>έχω πρόσβαση στο internet</span> για να διαβάζω ebooks.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/9.jpg"
		}
		,{
			question: "Βλέπω <span>web TV </span>μέσα από το tablet μου.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/1.jpg"
		}
		,{
			question: "Παθιάζομαι να <span>παίζω παιχνίδια </span>στο tablet.",
			options: ["Ναι", "Όχι"],
			answer: 0,
			image: "img/12.jpg"
		}
	];

	return {
		getQuestion: function(id, qAnswered) {
			//console.log("Id: "+ id);
			//console.log("questions.length: "+ questions.length);
			//console.log("qAnswered: "+ qAnswered);
			//
			//console.log("-----------------------------");
			if( qAnswered < 8) {
				return questions[id];
			} else {
				return false;
			}
		}
	};
});

  
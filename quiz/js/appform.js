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


app.directive('quiz', function(quizFactory, $window, $timeout) {
	return {
		restrict: 'AE',
		
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {


			scope.start = function() {
			
				scope.id = Math.floor((Math.random() * 9) );
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
				if(scope.endScreen<2)
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
				console.log("Question id: "+scope.id);
                console.log("q: "+q);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
                    scope.option1 = q.options[0];
                    scope.option2 = q.options[1];
                    scope.option3 = q.options[2];
					scope.answer = q.answer;
					scope.answerMode = true;
					scope.bg = q.image;
                    showQuestion();
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
            
            showQuestion = function() {
                
//                Reset all css effects and colos
//                 TweenMax.to(answ1, 0.2, { textShadow:"2px 2px 15px rgba(145, 233, 0, 1)",  backgroundColor:"#91ff00" });
                
                var answItems = [answ1, answ2, answ3];
                var answTimeline = new TimelineLite({paused:true});

                answTimeline.appendMultiple( TweenMax.allTo(answItems, 0.01, { backgroundColor:"#00b4c4" , textShadow:"1px 1px 1px rgba(145, 233, 0, 1)", boxShadow: "0px 0px 0px 0px rgba(0,255,0,0.3)", ease:Linear.easeNone}) );
                answTimeline.play();
                
//                Create the timeline and play it
                var tl = new TimelineLite();
                tl.from(bg, 0.5, {x:100, opacity:0})
                    .from(question, 0.5, {scale:0.5, opacity:0})
                .from(answ1, 0.5, {y:10, opacity:0})
                .from(answ2, 0.5, {y:20, opacity:0}, "-=0.4")
                .from(answ3, 0.5, {y:30, opacity:0}, "-=0.3");
                
                tl.play();
                
            }

			scope.checkAnswer = function(ans) {
				//if(!$('input[name=answer]:checked').length) return;
                //var ans = $('input[name=answer]:checked').val();
                
                
				if(ans == scope.answer) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
               if(scope.answer == 0) {
                TweenMax.to(answ1, 0.2, {
                    textShadow:"2px 2px 15px rgba(145, 233, 0, 1)",             
                    backgroundColor:"#91ff00"
                });
                   TweenMax.fromTo(answ1, 0.7, {
                        boxShadow: "0px 0px 0px 0px rgba(0,255,0,0.3)"
                    }, {
                        boxShadow: "0px 0px 20px 10px rgba(0,255,0,0.7)",
                        repeat: -1,
                        yoyo: true,
                        ease: Linear.easeNone
                    });
               } else if(scope.answer == 1) {
                TweenMax.to(answ2, 0.2, {
                    textShadow:"2px 2px 15px rgba(145, 233, 0, 1)",             
                    backgroundColor:"#91ff00"
                });
                   TweenMax.fromTo(answ2, 0.7, {
                        boxShadow: "0px 0px 0px 0px rgba(0,255,0,0.3)"
                    }, {
                        boxShadow: "0px 0px 20px 10px rgba(0,255,0,0.7)",
                        repeat: -1,
                        yoyo: true,
                        ease: Linear.easeNone
                    });
            }else if(scope.answer == 2) {
                TweenMax.to(answ3, 0.2, {
                    textShadow:"2px 2px 15px rgba(145, 233, 0, 1)",             
                    backgroundColor:"#91ff00"
                });
                TweenMax.fromTo(answ3, 0.7, {
                        boxShadow: "0px 0px 0px 0px rgba(0,255,0,0.3)"
                    }, {
                        boxShadow: "0px 0px 20px 10px rgba(0,255,0,0.7)",
                        repeat: -1,
                        yoyo: true,
                        ease: Linear.easeNone
                    });
            }
                
				//scope.answerMode = false;
                $timeout(callAtTimeout, 3000);
                
			};
            
            callAtTimeout = function() {
                 scope.questionsAnswered++;
                    scope.nextQuestion();
                   
               
            }            
            

			scope.nextQuestion = function() {
				//scope.id++;
				scope.id = Math.floor((Math.random() * 9) );
                console.log(scope.id);
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
            
//            //    TIMELINES
//            //    Click Button
//            var click1tl = new TimelineLite();
//
//                click1tl.add(TweenLite.to(scope.answ1, 0.05, {scaleX:0.5, scaleY:0.5, ease: Power2.easeOut}));
//                click1tl.stop();
//           
             
            scope.click1 = function(id){
                var click1tl = new TimelineLite();
            
                click1tl.add(TweenLite.to(answ1, 0.2, {scaleX:0.5, scaleY:0.5, ease: Power2.easeOut}));
                 click1tl.restart();
                click1tl.play();
            }
            
            scope.clickOut1 = function(){
                var clickOut1tl = new TimelineLite();
            
                clickOut1tl.add(TweenLite.to(answ1, 0.2, {scaleX:1, scaleY:1, ease: Power2.easeOut}));
                clickOut1tl.restart();
                clickOut1tl.play();
            }
           

  

       
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
		{
			question: "1. Χρησιμοποιώ το tablet μου για <span>να βλέπω ταινίες.</span>",
			options: ["Σωστη", "Λαθος","Λαθος"],
			answer: 0,
			image: "img/1.jpg"
		},
		{
			question: "2. Χρησιμοποιώ το tablet για να <span>ενημερώνομαι για το lifestyle.</span>",
			options: ["Λαθος", "Σωστη","Λαθος"],
			answer: 1,
			image: "img/2.jpg"
		}
		,{
			question: "3. Με το tablet ακούω κάθε στιγμή της ημέρας <span>την αγαπημένη μου μουσική.</span>",
			options: ["Λαθος", "Λαθος","Σωστη"],
			answer: 2,
			image: "img/3.jpg"
		}
		,{
			question: "4. Με το tablet μου <span>σερφάρω στο Internet</span> όλη μέρα κάθε μέρα, όπου κι αν βρίσκομαι!",
			options: ["Λαθος", "Σωστη","Λαθος"],
			answer: 1,
			image: "img/4.jpg"
		}
		,{
			question: "Ερώτηση 5",
			options: ["Σωστη", "Λαθος","Λαθος"],
			answer: 0,
			image: "img/5.jpg"
		}
		,{
			question: "6. Μπορώ να <span>κάνω καταδύσεις</span> με το tablet μου.",
			options: ["Λαθος", "Λαθος","Σωστη"],
			answer: 2,
			image: "img/6.jpg"
		}
		,{
			question: "7. Με το tablet μου <span>τρελαίνομαι να κάνω video κλήσεις.</span>",
			options: ["Σωστη", "Λαθος","Λαθος"],
			answer: 0,
			image: "img/7.jpg"
		}
		,{
			question: "8.Με το tablet <span>διαχειρίζομαι τους λογαριασμούς μου</span> στα social media.",
			options: ["Λαθος", "Σωστη","Λαθος"],
			answer: 1,
			image: "img/4.jpg"
		}
		,{
			question: "9. Χρησιμοποιώ το tablet μου για να <span>“τσατάρω” με τους φίλους μου</span> όπου κι αν βρίσκομαι.",
			options: ["Λαθος", "Λαθος","Σωστη"],
			answer: 2,
			image: "img/2.jpg"
		}
		,{
			question: "10. Η διάσταση της οθόνης ενός tablet μετριέται σε inches.",
			options: ["Λαθος", "Σωστη","Λαθος"],
			answer: 1,
			image: "img/bg.jpg"
		}
		
		
	];

	return {
		getQuestion: function(id, qAnswered) {
			//console.log("Id: "+ id);
			//console.log("questions.length: "+ questions.length);
			//console.log("qAnswered: "+ qAnswered);
			//
			//console.log("-----------------------------");
			if( qAnswered < 3) {
               console.log("Answered: "+qAnswered);
				return questions[id];
			} else {
				return false;
			}
		}
	};
});

  
$(document).ready(function(){

  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);

})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  photos: {
    q1:"1.jpg"
  },
  questions: {
    q1: 'F klavyenin mucidi olarak bilinen eğitimci yazar kimdir?',
    q2: 'Tubitak tarafından geliştirilen milli işletim sisteminin adı nedir?',
    q3: 'Türkiyede ilk internet hangi kurumdan bağlanılmıştır?' ,
    q4: 'Devlet kurumları internet sayfalarında hangi site uzantısını kullanır?',
    q5: "Jpg, hangi dosyaların dosya uzantısıdır?",
    q6: 'Bir belgeyi kaydetmek için hangi kısa yol tuşları kullanılır?',
    q7: "Kalimba versiyonunu dinlediniz müzik hangisine aittir?"
  },
  options: {
    q1: ['Cem Alhan','İhsan Sıtkı Yener', 'İlke Sipahi'],
    q2: ['Mac OS X', 'Linux', 'Pardus', 'Windows'],
    q3: ['ODTÜ', 'İTÜ', 'Türk Telekom', 'Turkcell'],
    q4: [ 'org', 'edu','gov', 'com'],
    q5: ['Metin','Resim','Ses'],
    q6: ['Ctrl+x','Ctrl+c', 'Ctrl+s', 'Ctrl+v'],
    q7: ['Mağusa Limanı', 'Çanakkale Türküsü', 'Selanik Türküsü','Drama Köprüsü']
  },
  answers: {
    q1: 'İhsan Sıtkı Yener',
    q2: 'Pardus',
    q3: 'ODTÜ',
    q4: 'gov',
    q5: 'Resim',
    q6: 'Ctrl+s',
    q7: 'Çanakkale Türküsü'
  },
  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Süre bitti. Doğru cevap: '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Oynadığın için teşekkürler!</h3>'+
        '<p>Doğru: '+ trivia.correct +'</p>'+
        '<p>Yanlış: '+ trivia.incorrect +'</p>'+
        '<p>Cevapsız: '+ trivia.unanswered +'</p>'+
        '<p>Tekrar oyna!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Doğru cevap!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Bir dahaki sefer iyi şanslar! Doğru cevap: '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}
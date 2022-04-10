const recipientForm = document.getElementById('recipientForm');
const sendNotificationForm = document.getElementById('sendNotificationForm');
const newRecipientInput = document.getElementById('newRecipientInput');
const newNameInput = document.getElementById('newNameInput');
const newBirthday = document.getElementById('newBirthdayInput');
const newMessage = document.getElementById('newMessage');
const recipientList = document.getElementById('recipients');
const resultSection = document.getElementById('resultSection');
const birthdayList = document.getElementById('birthdaypeople');

let recipients = [];
let people = [];
let birthdaypeople = [];

console.log("loaded");
if (!localStorage.recipients) {
  localStorage.setItem('recipients', JSON.stringify([]));
  localStorage.setItem('people', JSON.stringify([]));
} else {
  console.log();
  recipients = JSON.parse(localStorage.getItem('recipients'));
  people = JSON.parse(localStorage.getItem('people'));
  loadRecipients();
  loadBirthday();
}

function addRecipient(name, phoneNumber, birthday, message) {
  recipients.push(phoneNumber);
  console.log(message);
  people.push({name: name, number: phoneNumber, birthday: birthday, message: message});
  localStorage.setItem('recipients', JSON.stringify(recipients));
  localStorage.setItem('people', JSON.stringify(people));

  loadRecipients();
  loadBirthday();
}

function loadRecipients() {
  let newHTML = "";
  for (person of people) {
    newHTML += '<li>Name: ' + person.name + ', Number: ' + person.number + ', Birthday: ' + person.birthday + ', Message: ' + person.message + '</li>';
  }
  if (newHTML == "") {
    newHTML = "No one's birthday is today!";
  }
  recipientList.innerHTML = newHTML;
}

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}


function loadBirthday() {
  let newHTML = "";
  birthdaypeople = [];
  let today = new Date();
  for (person of people) {
    console.log(person.birthday);
    let tempDate = parseDate(person.birthday);
    console.log('today: ' + today + 'date: ' + tempDate);
    console.log(tempDate.getMonth() + " " + today.getMonth());
    console.log(tempDate.getDay() + " " + today.getDay());
    if (tempDate.getMonth() == today.getMonth() && tempDate.getDay() == today.getDay()) {
      
      console.log("It's this person's birthday");
      newHTML += '<li>Name: ' + person.name + ', Number: ' + person.number + ', Birthday: ' + person.birthday + '</li>';
      birthdaypeople.push({name: person.name, number: person.number, message: person.message});
    }
    
  }
  birthdayList.innerHTML = newHTML;
}

function clearForm(form) {
  // only clearing the passcode and leaving the message for convience
  form.passcode.value = '';
}

recipientForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (newRecipientInput.value && newNameInput.value) {
    console.log("WO");
    addRecipient(newNameInput.value, newRecipientInput.value, newBirthday.value, newMessage.value);
    newRecipientInput.value = '';
    newNameInput.value = '';
    newBirthday.value = '';
    newMessage.value = '';
  }
});

function sendMessages(form) {
  let message_list = [];
  console.log("hey");
  console.log(birthdaypeople);
  for (person of birthdaypeople) {
    message_list.push({number: person.number, content:person.message});
  }
  console.log(message_list);
  let data = {
    passcode: form.passcode.value,
    message: JSON.stringify(message_list),
    recipients: birthdaypeople.map(function(elem){return elem.number;}).join(','),
  };

  clearForm(form);

  fetch('send-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }

      if (resp.status === 401) {
        throw new Error('Invalid Passcode');
      } else {
        throw new Error(
          'Unexpected error. Please check the logs for what went wrong.'
        );
      }
    })
    .then((body) => {
      const successCount = body.result.reduce((currentCount, resultItem) => {
        return resultItem.success ? currentCount + 1 : currentCount;
      }, 0);

      resultSection.innerText = `Sent ${successCount} of ${body.result.length} messages. Check logs for details`;
    })
    .catch((err) => {
      resultSection.innerText = err.message;
    });
}

sendNotificationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (recipients.length === 0 && newRecipientInput.value && newNameInput.value) {
    addRecipient(newNameInput.value, newRecipientInput.value, newBirthday.value, newMessage.value);
    newRecipientInput.value = '';
    newNameInput.value = '';
    newBirthday.value = '';
    newMessage.value = '';
  }

  if (recipients.length === 0) {
    resultSection.innerText = 'Please enter at least one phone number';
  } else {
    resultSection.innerText = 'Sending messages. One moment';
    sendMessages(evt.target);
  }
});

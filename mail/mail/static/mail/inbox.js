document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#content').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Disabling button by default
  document.querySelector('#submit').disabled = true;

  document.querySelector('#compose-recipients').onkeyup = () => {
    if (document.querySelector('#compose-recipients').value.length > 0) {
      document.querySelector('#submit').disabled = false;
    } else {
      document.querySelector('#submit').disabled = true;
    }
  }

  // Sending the mail
  document.querySelector('form').onsubmit = () => {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
    })

    // Stop form form submitting
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#content').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  if (mailbox === "archive") {
    load_archive();
  } else {
    load_allMail(mailbox);
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function content(id) {
  document.querySelector('#content').style.display = 'block';
  document.querySelector('#sent-mail').innerHTML = '';
  document.querySelector('#mail-content').innerHTML = '';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    const container3 = document.createElement('div');
    const container4 = document.createElement('div');
    
    container1.innerHTML = `<b>From:</b>${email.sender}`;
    document.querySelector('#mail-content').append(container1);

    container2.innerHTML = `<b>Recipients:</b>${email.recipients}`;
    document.querySelector('#mail-content').append(container2);

    container3.innerHTML = `<b>Subject:</b>${email.subject}`;
    document.querySelector('#mail-content').append(container3);

    container4.innerHTML = `<b>Body:</b>${email.body}`;
    document.querySelector('#mail-content').append(container4);

  })

  document.querySelector('#read').addEventListener('click', () => read_archive(id, "read"));
  document.querySelector('#archive').addEventListener('click', () => read_archive(id, "archived"));
  
}

function load_allMail(mailbox) {
  document.querySelector('#sent-mail').innerHTML = '';

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(element => {
      if (element.archived == false) {
        let container = document.createElement('div');
        if (element.read == true ) {
          container.innerHTML = `<div onclick="content(${element.id})" class="container-sent">${element.recipients} <b>${element.subject}</b> ${element.body} <p>      </p>${element.timestamp} </div>`;
          container.style.color = "grey";
        } 
        container.innerHTML = `<div onclick="content(${element.id})" class="container-sent">${element.recipients} <b>${element.subject}</b> ${element.body} <p>      </p>${element.timestamp} </div>`;
        document.querySelector('#sent-mail').append(container);
      }
      
    });

  })
}

function read_archive(id, str) {
  if (str === "read") {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify ({
        read: true
      })
    })
  } else {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify ({
        archived: true
      })
    })
  }
}

function load_archive() {
  document.querySelector('#sent-mail').innerHTML = '';

  fetch(`/emails/archive `)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(element => {
      if (element.archived == true) {
        let container = document.createElement('div');
        if (element.read == true ) {
          container.innerHTML = `<div onclick="content(${element.id})" class="container-sent">${element.recipients} <b>${element.subject}</b> ${element.body} <p>      </p>${element.timestamp} </div>`;
          container.style.color = "grey";
        } 
        container.innerHTML = `<div onclick="content(${element.id})" class="container-sent">${element.recipients} <b>${element.subject}</b> ${element.body} <p>      </p>${element.timestamp} </div>`;
        document.querySelector('#sent-mail').append(container);
      }
      
    });

  })
}
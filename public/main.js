$(document).ready(function () {
        var socket = io.connect('http://localhost:3000');
        var name = null;
        $('.chat').hide();
        var messages = $("#messages");
        var message_txt = $("#message_text")
        var people = {};
        function msg(nick, message) {
            var m = '<div class="msg">' +
                    '<span class="user">' + safe(nick) + ':</span> '
                    + safe(message) +
                    '</div>';
            messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
        }

        function msg_system(message) {
            var m = '<div class="msg system">' + safe(message) + '</div>';
            messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
        }
        $('form[name="auth"]').submit(function() {
          set();
          $(this).hide();
          return false;
        })

        function set() {
          if($('input[name="name"]').val() != '') {
            name = $('input[name="name"]').val() + "_" + (Math.round(Math.random() * 10000));
          }
          else {
            name = "Незнакомец_" + (Math.round(Math.random() * 10000));
          }
          $('.chat .nick').text(name);
          $('.chat').show();
          socket.emit("add user", name);
        }
        socket.on('user left', function (name) {
          if(name)
            msg_system(name + ' покинул чат');
        });
        socket.on('new user', function (name) {
            msg_system(name + ' подключился к чату');
        });


        socket.on('message', function (data) {
            msg(data.name, data.message);
            message_txt.focus();
        });

        $("#message_btn").click(function () {
            var text = $("#message_text").val();
            if (text.length <= 0)
                return;
            message_txt.val("");
            socket.emit("message", {message: text, name: name});
        });

        function safe(str) {
            return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
        }
    });

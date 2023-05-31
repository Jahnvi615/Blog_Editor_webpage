document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById('blogForm');
    let contentInput = document.getElementById('contentInput');
    let fileInput = document.getElementById('fileInput');
    let videoInput = document.getElementById('videoInput');
    let outputDiv = document.getElementById('output');

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      let content = contentInput.value;
      let outputHTML = '<div class="blog-post"><p>' + content + '</p>';

      if (fileInput.files && fileInput.files[0]) {
        let file = fileInput.files[0];
        let reader = new FileReader();

        reader.onload = function(e) {
          let image = new Image();
          image.src = e.target.result;

          image.onload = function() {
            let imageHTML = '<img class="resizable" src="' + image.src + '" alt="Uploaded Image">';
            outputHTML += imageHTML;
            handleVideoUpload(outputHTML); // Pass outputHTML to handleVideoUpload function
          };
        };

        reader.readAsDataURL(file);
      } else {
        handleVideoUpload(outputHTML); // Pass outputHTML to handleVideoUpload function
      }

      contentInput.value = '';
      fileInput.value = '';
      videoInput.value = '';
    });

    function handleVideoUpload(outputHTML) {
      if (videoInput.files && videoInput.files[0]) {
        let videoFile = videoInput.files[0];
        let reader = new FileReader();

        reader.onload = function(e) {
          let videoURL = window.URL.createObjectURL(videoFile);
          let videoHTML = '<video class="resizable" src="' + videoURL + '" controls></video>';
          outputHTML += videoHTML;
          outputHTML += '</div>';
          outputDiv.innerHTML += outputHTML;
        };

        reader.readAsDataURL(videoFile);
      } else {
        outputHTML += '</div>';
        outputDiv.innerHTML += outputHTML;
      }
    }

    interact('.resizable')
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        listeners: {
          start(event) {
            event.target.classList.add('dragging');
          },
          move(event) {
            let target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          end(event) {
            event.target.classList.remove('dragging');
          }
        }
      })
      .resizable({
        edges: {
          top: true,
          left: true,
          bottom: true,
          right: true
        },
        listeners: {
          start(event) {
            event.target.classList.add('resizing');
          },
          move(event) {
            let target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
            target.style.transform = `translate(${x}px, ${y}px)`;
          },
          end(event) {
            event.target.classList.remove('resizing');
            event.target.setAttribute('data-x', event.target.offsetLeft);
            event.target.setAttribute('data-y', event.target.offsetTop);
          }
        }
      });
  });
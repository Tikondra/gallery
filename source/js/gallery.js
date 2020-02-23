(function () {
  const fileTypes = ['json'];
  const heightBase = 170;
  let fileChooser = document.querySelector('input[type=file]');
  let fileLoad = document.querySelector('input[type=url]');
  let imgList = document.querySelector('.gallery__list');
  let form = document.querySelector('form');

  let renderImg = function (data) {
    let fragment = document.createDocumentFragment();
    data.galleryImages.forEach(function (image) {
      let galleryImg = document.createElement('img');
      let ratio = image.width / image.height;
      let widthBase = ratio * heightBase;

      galleryImg.classList.add('gallery__img');
      galleryImg.src = image.url;
      galleryImg.width = widthBase;
      galleryImg.height = heightBase;
      galleryImg.style.flexGrow = ratio;
      fragment.append(galleryImg);
    });
    imgList.append(fragment);
  };
  let cleaningImg = function () {
    let activeImg = document.querySelectorAll('.gallery__img');
    if (activeImg) {
      activeImg.forEach(function (img) {
        img.remove();
      })
    }
  };
  let cleaningForm = function () {
    let errorMessage = document.querySelector('.gallery__error');
    if(errorMessage) {
      errorMessage.remove();
    }
    form.reset();
  };
  let errorLoad = function () {
    fileLoad.style.borderColor = "red";
    let error = document.createElement('span');
    error.classList.add('gallery__error');
    error.textContent = 'Произошла ошибка';
    fileLoad.after(error);
  };
  let onValidationUrl = function (evt) {
    if (!evt.target.value.endsWith(fileTypes)) {
      evt.target.setCustomValidity('Только json');
      return false;
    } else {
      evt.target.setCustomValidity('');
      return true;
    }
  };
  /** загрузка через файл */
  let onLoadFile = function (evt) {
    let file = fileChooser.files[0];
    let fileName = file.name.toLowerCase();

    let matches = fileTypes.some(function (item) {
      return fileName.endsWith(item);
    });
    if (matches) {
      let reader = new FileReader();

      reader.addEventListener('load', function () {
        let gallery = (JSON.parse(reader.result));
        cleaningImg();
        renderImg(gallery);
        cleaningForm();
      });
      reader.readAsText(file);
      evt.target.style.border = 'none';
    } else {
      evt.target.style.border = '1px solid red';
    }
  };
  /** загрузка черенз url */
  let onLoadUrl = function (evt) {
    evt.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        renderImg(xhr.response);
        fileLoad.style.border = "1px solid rgb(227, 227, 227)";
        cleaningForm();
      } else {
        errorLoad();
      }
    });
    xhr.open('GET', fileLoad.value);
    xhr.send();
  };

  fileChooser.addEventListener('change', onLoadFile);
  fileLoad.addEventListener('blur', onValidationUrl);
  form.addEventListener('submit', onLoadUrl);
})();

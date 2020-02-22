(function () {
  var FILE_TYPES = ['json'];
  var HEIGHT__BASE = 170;
  var fileChooser = document.querySelector('input[type=file]');
  var fileLoad = document.querySelector('input[type=url]');
  var imgList = document.querySelector('.gallery__list');
  var form = document.querySelector('form');

  // отрисовка картинок
  var renderImg = function (data) {
    var fragment = document.createDocumentFragment();
    data.galleryImages.forEach(function (it) {
      var galleryImg = document.createElement('img');
      var ratio = it.width / it.height;
      var widthBase = ratio * HEIGHT__BASE;
      galleryImg.classList.add('gallery__img');
      galleryImg.src = it.url;
      galleryImg.width = widthBase;
      galleryImg.height = HEIGHT__BASE;
      fragment.append(galleryImg);
    });
    imgList.append(fragment);
  };
  // очистка перед отрисовкой
  var cleaningImg = function () {
    var activeImg = document.querySelectorAll('.gallery__img');
    if (activeImg) {
      activeImg.forEach(function (it) {
        it.remove();
      })
    }
  };
  // загрузка через файл
  var onLoadFile = function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var gallery = (JSON.parse(reader.result));
        cleaningImg();
        renderImg(gallery);
      });
      reader.readAsText(file);
      fileChooser.style.border = 'none';
    } else {
      fileChooser.style.border = '1px solid red';
    }
  };
  // загрузка через ссылку
  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
        fileLoad.style.borderColor = "#000";
      } else {
        fileLoad.style.borderColor = "red";
      }
    });
    xhr.open('GET', fileLoad.value);
    xhr.send();
  };

  fileChooser.addEventListener('change', onLoadFile);
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    load(renderImg);
  });
})();

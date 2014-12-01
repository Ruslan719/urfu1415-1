define(["jquery"], function ($) {
$(document).ready(function () {
    //������� � �������
    var $span_element;
    //������� ��� ���������(canvas) ����
    var foto = document.getElementById("foto");
    var foto_context = foto.getContext("2d");
    //��� ������ ��������
    var reader = new FileReader();
    var img = new Image();
    //������� ��� ������ �����������
    var video = document.getElementById("camera");
    //����������
    var videoStreamUrl = false;
    //canvas ��� �������
    var signature = document.getElementById("signature");
    var signature_context = signature.getContext("2d");
    var is_drawing = false;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    reader.onload = function (event) {
        var dataUri = event.target.result;
	//�����, ���� ����������� �� ����� ��������� ����������
        img.onload = function () {
            //����������� ������ ���� � ����� �� ���������� ������ � ������ ��� � �������� foto
            foto_context.drawImage(img, 0, 0, foto.width, foto.height);
        };
        img.src = dataUri;
    };

    //�������� ���� ����������(����� �����)
    function change_text() {
        //������� ���� ��� �����
        $input_element = $("<input class='input'></input>");
        //��� ������ ������ ��������� �����
        $input_element.blur(save_text);
        //��������� ������� � �������
        $span_element = $(this);
        //�������� ����� �� ���� �����
        $(this).replaceWith($input_element);
        $input_element.focus();
    }

    //��������� �����, ��������� � input
    function save_text() {
        if ($(this).val().length > 0) {
            $span_element.text($(this).val());
        }
        $span_element.click(change_text);
        //���������� ������� � �������
        $(this).replaceWith($span_element);
    }

    function load_from_file() {
        var file = document.getElementById('file').files[0];
        reader.readAsDataURL(file);
        $(".get_foto").hide();
        $("#hide").hide();
	$("#clear").hide();
    }

    //��������� ����������� � ������ � video
    function start_camera() {
        navigator.getUserMedia({
            video: true
        }, function (stream) {
            // ���������� �� ������������ ��������

            try {
                window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;
                // �������� url ��������� �����
                videoStreamUrl = window.URL.createObjectURL(stream);
                //������������� ��� �������� ��� video
                video.src = videoStreamUrl;
            } catch (exception_var) {
                alert("Your browser does not support video stream");
            }
        }, function () {});
    }

    //���������� ������ �� 4 ���������-����������, �������� ������� ���� � ������
    //������� ����������� � ����������� �� �������� foto
    function central_area() {
        var ratio = foto.width / foto.height;
        if (ratio < video.videoWidth / video.videoHeight) {
            var new_width = video.videoHeight * ratio
            return [(video.videoWidth - new_width) / 2, 0, new_width, video.videoHeight]
        } else {
            var new_height = video.videoWidth * ratio
            return [0, (video.videoHeight - new_height) / 2, video.videoWidth, new_height]
        }
    }

    function capture() {
        if (!videoStreamUrl) {
            alert("Camera is disabled");
            return;
        }

        //��������� �������
        var params = central_area();
        // ������������ �� canvas ������� ���������� ���� �����
        foto_context.drawImage(video, params[0], params[1], params[2], params[3], 0, 0, foto.width, foto.height);
        $(".get_foto").hide();
        $("#hide").hide();
	$("#clear").hide();
    }

    //�������� ������� ������

    $(".text").click(change_text);
    $(".text2").click(change_text);
    $("#foto").click(function () {
        $("#hide").show();
        $(".get_foto").show();
    });
    $("#load").click(load_from_file);
    $("#start").click(start_camera);
    $("#capture").click(capture);
    $("#hide").click(function () {
        $("#hide").hide();
        $(".get_foto").hide();
        $("#clear").hide();
    });
    $("#clear").click(function () {
        signature_context.clearRect(0, 0, signature.width, signature.height);
    });

    //�������� ������� ��� ���������

    signature.onmousedown = function (e) {
        $("#clear").show();
        $("#hide").show();
        signature_context.beginPath();
        signature_context.moveTo(e.offsetX, e.offsetY);
        is_drawing = true;
    }

    signature.onmouseup = function (e) {
        is_drawing = false;
    }

    signature.onmouseout = function (e) {
        is_drawing = false;
    }

    signature.onmousemove = function (e) {
        if (is_drawing) {
            signature_context.lineTo(e.offsetX, e.offsetY);
            signature_context.stroke();
        }
    }
});
});
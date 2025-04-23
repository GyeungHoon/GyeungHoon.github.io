
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("daum_extraAddress").value = extraAddr;

            } else {
                document.getElementById("daum_extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('daum_postcode').value = data.zonecode;
            document.getElementById("daum_address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("daum_detailAddress").focus();
        }
    }).open();
}

function execDaumPostcode_comment() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("addressComment").value = extraAddr;

            } else {
                document.getElementById("addressComment").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            // document.getElementById('daum_postcode_comment').value = data.zonecode;
            document.getElementById("addressComment").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            // document.getElementById("daum_detailAddress_comment").focus();
        }
    }).open();
}






document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    const textareas = document.querySelectorAll("textarea.notice__form-element");
    const daumAddress = document.getElementById("daum_address");
    const subject = document.getElementById("subject");

    function checkRequiredFields() {
        const allTextareasFilled = Array.from(textareas).every(
            (t) => t.value.trim() !== ""
        );
        const daumAddressFilled = daumAddress && daumAddress.value.trim() !== "";
        const subjectSelected = subject && subject.value.trim() !== "";

        const allValid = allTextareasFilled && daumAddressFilled && subjectSelected;

        submitBtn.disabled = !allValid;
        submitBtn.classList.toggle("active", allValid);
    }

    // null 체크 먼저 해주고 이벤트 바인딩
    [...textareas, daumAddress, subject].forEach((el) => {
        if (el) {
            el.addEventListener("input", checkRequiredFields);
            el.addEventListener("change", checkRequiredFields);
        }
    });

    checkRequiredFields(); // 초기 체크
});




// 게시글 본문 다중첨부
document.addEventListener("DOMContentLoaded", () => {
    const mainImageInput = document.getElementById("mainImageInput");
    const previewContainer = document.getElementById("mainPreviewContainer");
    const hiddenInput = document.getElementById("mainImageUrls");
    const form = document.getElementById("uploadForm");
  
    let mainImageFiles = [];
  
    // 1. 파일 선택 시 썸네일 미리보기만 (클라우드 업로드 X)
    mainImageInput.addEventListener("change", () => {
      const files = Array.from(mainImageInput.files);
  
      if (files.length > 8) {
        alert("이미지는 최대 8장까지만 업로드할 수 있습니다.");
        mainImageInput.value = "";
        previewContainer.innerHTML = "";
        return;
      }
  
      mainImageFiles = files;
      previewContainer.innerHTML = "";
  
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "100%";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  
    // 2. 제출 시에만 순차 업로드 + 썸네일도 순서대로 다시 표시
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const CLOUD_NAME = "dcf56b3ch";
      const UPLOAD_PRESET = "DNBStoryge";
      const uploadedUrls = [];
  
    //   previewContainer.innerHTML = ""; // 클라우드 업로드된 이미지 기준으로 썸네일 다시 보여주기
  
      for (const file of mainImageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "carrot_img");
  
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          });
  
          const data = await res.json();
          if (data.secure_url) {
            uploadedUrls.push(data.secure_url);
  
            // Cloudinary 업로드 순서 기준으로 썸네일 보여줌
            // const img = document.createElement("img");
            // img.src = data.secure_url;
            // img.style.width = "100%";
            // img.style.height = "100px";
            // img.style.objectFit = "cover";
            // previewContainer.appendChild(img);
          }
        } catch (err) {
          console.error("이미지 업로드 실패:", err);
        }
      }
  
      hiddenInput.value = JSON.stringify(uploadedUrls);
  
      console.log("이미지 URI :"+hiddenInput.value);
      //폼 최종 제출 (서버 연결되어 있으면 사용)
      // form.submit();
      alert("본문 이미지 업로드가 완료되었습니다!");
    });
  });
  
  






// 댓글 사진 단일첨부
document.addEventListener("DOMContentLoaded", () => {

    const CLOUD_NAME = "dcf56b3ch";
    const UPLOAD_PRESET = "DNBStoryge";

    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("preview");

    // 1. 이미지 선택 → 로컬 미리보기
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    // 2. 제출 시에만 업로드 & DB 저장
    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const file = imageInput.files[0];
        if (!file) return alert("이미지를 선택해주세요");

        const timestamp = Date.now();
        const fileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '');
        const publicId = `carrot_img/${fileName}_${timestamp}`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "carrot_img"); // 폴더 지정;
        formData.append("public_id", publicId);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error.message);

            const imageUrl = data.secure_url;
            document.getElementById("imageUrl").value = imageUrl;

            // 👉 DB에 저장 요청
            await fetch('/save-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });

            alert("이미지 업로드 및 DB 저장 완료!");

        } catch (err) {
            console.error("에러 발생:", err);
            alert("업로드 또는 저장 실패: " + err.message);
        }
    });

});







document.addEventListener("DOMContentLoaded", () => {
    const textareas = document.querySelectorAll('textarea[data-target]');
  
    textareas.forEach((textarea) => {
      const targetId = textarea.getAttribute("data-target");
      const max = textarea.getAttribute("data-max") || textarea.maxLength;
      const counter = document.getElementById(targetId);
  
      const updateCount = () => {
        counter.textContent = `${textarea.value.length} / ${max}`;
      };
  
      textarea.addEventListener("input", updateCount);
      updateCount(); // 초기화
    });
  });
  



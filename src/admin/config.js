// ─────────────────────────────────────────────────────────────
//  관리자 설정
//
//  로그인은 Supabase Auth 가 처리합니다.
//  비밀번호는 로그인 폼에서 그때그때 입력받고, 코드에는 두지 않습니다.
//
//  아래 UID 는 '비밀'이 아닙니다. 화면을 보여 줄지 말지 정하는 용도일 뿐이고,
//  진짜 권한 검사는 Supabase 쪽 RLS 규칙이 합니다 (supabase/admin-policies.sql).
//  즉 이 값을 고쳐도 남의 데이터를 건드릴 수는 없습니다.
// ─────────────────────────────────────────────────────────────

/** 작품을 등록·수정·삭제할 수 있는 단 한 사람 */
export const ADMIN_UID = '8cac450f-eb26-4123-af63-d88e202639ff'

/**
 * 마지막에 로그인한 이메일을 기억해 두는 열쇠 이름.
 *
 * 관리자 이메일은 코드에 적지 않습니다.
 * 적어 두면 사이트를 여는 누구에게나 보이고(자바스크립트 파일 안에 그대로 남습니다),
 * 개인 메일 주소가 공개되어 스팸·피싱 표적이 됩니다.
 *
 * 대신 로그인에 성공한 브라우저에만 기억시켜 둡니다.
 * 내 컴퓨터에서는 자동으로 채워지고, 남의 화면에는 빈칸으로 보입니다.
 */
export const LAST_EMAIL_KEY = 'jh-admin-last-email'

/** 사진·영상을 넣어 둘 칸 이름 (Storage 규칙이 이 두 개만 허용합니다) */
export const FOLDERS = {
  image: 'images',
  video: 'videos',
}

/** 고를 수 있는 파일 갈래 */
export const MEDIA = {
  image: {
    label: '사진',
    accept: 'image/*',
    hint: 'JPG · PNG · SVG · WebP',
    folder: FOLDERS.image,
    column: 'image_url',
  },
  video: {
    label: '영상',
    accept: 'video/*',
    hint: 'MP4 · WebM · MOV',
    folder: FOLDERS.video,
    column: 'video_url',
  },
}

/**
 * 이 크기를 넘으면 미리 알려 줍니다.
 * Supabase 무료 요금제는 파일 하나당 50MB 까지 받습니다.
 */
export const SIZE_WARN = 50 * 1024 * 1024

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GalleryConfig, ExhibitionPost, RentalInquiry } from './types.ts';
import galleryWhiteHallImg from './assets/images/gallery_white_hall_1788153730031.jpg';
import defaultFloorPlanImg from './assets/images/lim303_floor_plan_1788158721862.jpg';

export const INITIAL_CONFIG: GalleryConfig = {
  siteName: 'LIM303 GALLERY',
  siteSubName: 'PROJECT & EXHIBITION SPACE',
  siteDescription: '빛과 공간, 그리고 예술이 스며드는 프리미엄 대관 미술관',
  aboutText: 'LIM303 GALLERY는 독창적인 시각을 지닌 현대 미술가과 대중을 연결하는 세련되고 감각적인 복합 예술 공간입니다. 백색의 미니멀한 공간 구성과 정교한 조명 시스템을 통해, 작품 본연의 온전한 호흡을 지탱합니다. 참신한 기획 전시부터 수준 높은 개인전, 브랜드 팝업 및 창의적 대관까지 예술이 살아 숨 쉬는 최상의 환경을 제공합니다.',
  aboutImage: galleryWhiteHallImg, // High-ceiling white gallery space with spot track lights
  aboutImage2: 'https://images.unsplash.com/photo-1582555762489-7f3972236838?q=80&w=1000', // Architectural details
  aboutImages: [
    galleryWhiteHallImg,
    'https://images.unsplash.com/photo-1582555762489-7f3972236838?q=80&w=1000',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200',
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1200',
  ],
  
  // Contact details
  address: '서울특별시 종로구 삼청로 62-9 (소격동)',
  phone: '010-8020-5499',
  email: 'lim303gallery@gmail.com',
  hoursWeekday: '오전 10:30 - 오후 6:30',
  hoursWeekend: '오전 11:00 - 오후 7:00',
  closedDays: '매주 월요일 휴관',
  
  // Customizer styling (Prussian Blue & Silver)
  pointColor: '#003153', // Prussian Blue
  pointColorLight: '#F0F4F8', // Silver-tinted Ice tone
  fontFamily: 'sans',
  cardStyle: 'bordered',
  heroHeight: 'medium',
  heroBackgroundMode: 'minimal',
  heroBackgroundImage: '',
  heroOverlayOpacity: 0,
  
  // Social networks
  instagram: 'https://instagram.com/lim303_gallery_official',
  facebook: 'https://facebook.com/lim303gallery',
  naverBlog: 'https://blog.naver.com/lim303gallery',
  
  // Rental details (SPACE SPECIFICATION)
  rentalArea: '116㎡ (약 35평)',
  rentalCapacity: '최대 60명 동시 수용 가능',
  rentalHeight: '2.6m ~ 4.0m',
  rentalEquipment: '전문가용 레일 조명, 음향 스피커, 와이파이, 빔프로젝터, 전시대 및 이동식 화이트 가벽',
  floorPlanImage: defaultFloorPlanImg,
  showHeroCurrentExhibition: false, // Hidden by default, can be toggled on anytime
  formspreeEndpoint: 'https://formspree.io/f/mljegbyn',
};

export const INITIAL_EXHIBITIONS: ExhibitionPost[] = [
  {
    id: 'exhibit-1',
    title: '기억의 파편: 흔적을 거닐다',
    artist: '백지우 작가 (Beak Ji-woo)',
    period: '2026. 05. 20 - 2026. 06. 15',
    description: '시간이 흘러 바래진 개인의 기억들을 유화의 정교한 마티에르 기법을 활용해 캔버스 위에 고고학적으로 발굴하며 채색한 전시입니다. 물감의 겹침과 갈라짐 속에서 과거의 아련한 흔적을 탐닉하는 사색적인 시간을 선사합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800',
    category: 'current',
    createdAt: Date.now() - 50000000
  },
  {
    id: 'exhibit-2',
    title: '고요한 울결: 디지털 네이처',
    artist: '한민준 미디어 아티스트',
    period: '2026. 06. 22 - 2026. 07. 10',
    description: '가상 세계의 중력 이론과 유기체의 생장 패턴을 융합하여 컴퓨터 그래픽을 통한 실시간 키네틱 영상과 레이저 구조로 구성한 초현실적 인터랙티브 미디어아트 전시입니다. 자연의 불규칙한 흔들림을 디지털 시그널로 재생합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800',
    category: 'upcoming',
    createdAt: Date.now() - 40000000
  },
  {
    id: 'exhibit-3',
    title: '도시의 온도: 구조적 대조',
    artist: '최서연 작가 (Choi Seo-yeon)',
    period: '2026. 04. 10 - 2026. 05. 05',
    description: '거대한 메트로폴리스의 매가톤급 가로등, 차가운 유리 반사판, 그리고 그 이면에서 요동치는 생동감 넘치는 보행자의 미시적 감정을 기하학적 도형과 중성적인 색채를 이용해 표현한 현대 아크릴 추상화전입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
    category: 'past',
    createdAt: Date.now() - 300000000
  }
];

export const INITIAL_INQUIRIES: RentalInquiry[] = [
  {
    id: 'inquiry-1',
    name: '김도윤',
    phone: '010-1234-5678',
    email: 'doyun@artstudio.com',
    desiredPeriod: '2026년 9월 중 (1주일 대관)',
    artworkType: '회화 (서양화 및 조각 약 25점)',
    message: '개인전 대관을 계획 중입니다. 벽면에 레일 조명 각도 조절이 가능한지, 그리고 안내 데스크 요원을 지원해 주시는지 여쭙고 싶습니다.',
    createdAt: Date.now() - 172800000, // 2 days ago
    status: 'pending'
  },
  {
    id: 'inquiry-2',
    name: '이지민 (브랜드 실장)',
    phone: '010-9876-5432',
    email: 'jimin.lee@brandlab.co.kr',
    desiredPeriod: '2026년 10월 12일 - 15일',
    artworkType: '현대 가구 콜라보 팝업 쇼룸',
    message: '친환경 목재 가구 론칭 쇼케이스를 위한 주말 대관 문의입니다. 실내에 대형 가벽 조절이 가능한 환경인지 사전 미팅을 원합니다.',
    createdAt: Date.now() - 86400000, // 1 day ago
    status: 'reviewed'
  }
];

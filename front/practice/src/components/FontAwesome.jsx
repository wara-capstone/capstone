// 라이브러리
import { library } from "@fortawesome/fontawesome-svg-core";
// 사용할 아이콘 import
import {
  faBarcode,
  faHashtag,
  faHome,
  faMagnifyingGlass,
  faMapLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// 사용할 아이콘을 라이브러리에 추가
library.add(
  faMapLocationDot,
  faBarcode,
  faHome,
  faMagnifyingGlass,
  faUser,
  faHashtag
);

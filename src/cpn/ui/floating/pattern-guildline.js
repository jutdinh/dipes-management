import { useEffect } from "react";

const PatternGuideLine = () => {
  useEffect(() => {
    console.log("SHOW");
  }, []);

  return (
    <div className="floating-box change-icon">
      <div className="title">
        <span>PATTERN</span>
      </div>

      <div className="icons-container p-4">
        <p>Mã gồm 16 kí tự: [1..3] :</p>
        <p>Giá trị tại pattern [4..4] :</p>
        <p>Tháng hiện tại (A - L) [5..6] :</p>
        <p>2 số cuối của năm, [7..16] :</p>
        <p>
          Mã tự tăng từ A -Z và từ 0-9 (chuyển từ base 10 sang các base bất kỳ)
        </p>
      </div>
    </div>
  );
};
export default PatternGuideLine;

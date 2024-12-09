/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tab,
  Typography,
  TextField,
  Alert,
  Stack,
} from "@mui/material";

import axios from "axios";

const Sale = () => {
  

  return (
  <Box sx={{width:'100%',  padding:0, margin:0,boxSizing:'border-box'}}>
      <Box sx={{
        display: "flex",maxWidth: "1300px",justifyContent: "center",margin: "auto", flexDirection:'column'
      }}>
      <Box sx={{margin:'15px', border: "0.5px solid #ffffff", backgroundColor:'#f4f4f4', borderRadius: "8px",}}>
       <Box sx={{width:'95%', margin:'auto', display:'flex', flexDirection:'column', }}>
       <Typography className="button57">Khuyến mãi đặt xe khách</Typography>
        <Typography className="button58" sx={{textAlign:'center'}}>Khuyến mãi hấp dẫn khi đặt xe khách trực tuyến</Typography>
        <Typography className="button59"> Nhận các ưu đãi đặt xe khách hấp dẫn trên khắp Việt Nam trên VeXeOnline. Du khách có thể  nhanh chóng, dễ dàng và nhanh chóng trên VeXeOnline. 
            Nếu bạn đang tìm cách tiết kiệm tiền cho các ưu đãi đặt xe khách trực tuyến ngày hôm nay, chỉ cần sử dụng phiếu giảm giá đặt xe buýt trên VeXeOnline 
            và tận hưởng mức tiết kiệm tuyệt vời!
        </Typography>
       </Box>
      </Box>
      <Box sx={{margin:'15px', border: "0.5px solid #ffffff", backgroundColor:'#f4f4f4', borderRadius: "8px",}}>
       <Box sx={{width:'95%', margin:'auto', display:'flex', flexDirection:'column', }}>
        <Typography className="button58" sx={{textAlign:'left', marginTop:'20px'}}>Khuyến mãi vé xe khách</Typography>
        <Typography className="button59"> Bạn đang tìm kiếm các ưu đãi đặt xe buýt trực tuyến độc quyền? Bạn có thể tìm thấy các ưu đãi vé xe khách, phiếu giảm giá hoặc mã khuyến mại giảm giá để đặt vé xe khácch tại cổng thông tin VeXeOnline hoặc Ứng dụng di động. Cho dù là ưu đãi dành cho người dùng mới hay dành cho tất cả người dùng, bạn có thể tìm thấy tất cả các ưu đãi đặt xe khách, mã khuyến mại và ưu đãi đối tác thanh toán tốt nhất có sẵn trên trang này.
        </Typography>
        <Typography className="button59"> Bạn có thể tìm thấy các ưu đãi đặt xe buýt hấp dẫn có sẵn trên nền tảng VeXeOnline trên cả trang web và Ứng dụng di động!! Hãy chú ý đến các ưu đãi chỉ dành cho Ứng dụng, bạn có thể được hưởng các mức giảm giá đặc biệt cho các giao dịch đặt xe khách được thực hiện thông qua VeXeOnline.        </Typography>
        <Typography className="button59"> VeXeOnline thường xuyên bổ sung các ưu đãi mới để mang lại lợi ích cho khách hàng, vì vậy hãy nhớ kiểm tra lại để biết ưu đãi đặt vé xe khách mới nhất.
        </Typography>
        <Typography className="button59"> Nhanh chân lên!!! Lên kế hoạch cho chuyến đi của bạn và tận dụng các ưu đãi đặt vé xe buýt tuyệt vời từ AbhiBus trên khắp Việt Nam. Tận dụng các ưu đãi giảm giá vé xe khách và mã phiếu giảm giá áp dụng để đặt vé xe khách của bạn ngay hôm nay!!!      </Typography>
       </Box>
      </Box>

      <Box sx={{margin:'15px', border: "0.5px solid #ffffff", backgroundColor:'#f4f4f4', borderRadius: "8px",}}>
       <Box sx={{width:'95%', margin:'auto', display:'flex', flexDirection:'column', }}>
        <Typography className="button58" sx={{textAlign:'left', marginTop:'20px'}}>Khuyến mãi đặt vé xe khách trực tuyến tại VeXeOnline</Typography>
        <Typography className="button59">VeXeOnline cung cấp cho bạn nhiều lựa chọn để lựa chọn, đảm bảo bạn có một chuyến đi thoải mái. Chọn từ danh mục xe buýt lớn, chọn ghế ngồi yêu thích, tiện nghi xe khách và giá vé thấp nhất. Đặt vé xe khách trực tuyến trên khắp Việt Nam từ nhiều đối tác xe khách với VeXeOnline. VeXeOnline cung cấp các chương trình giảm giá và hoàn tiền cho cả người dùng mới và tất cả người dùng. Chọn sự kết hợp tốt nhất và đặt vé xe khách của bạn để tiết kiệm tối đa giá vé. </Typography>
        <Typography className="button59"> VeXeOnline là nền tảng tốt nhất để nhận được các ưu đãi giảm giá tốt nhất cho việc đặt vé xe khách trong năm 2024. VeXeOnline hợp tác với các nhà điều hành xe khách đáng tin cậy và phục vụ các tuyến xe khách trên khắp Việt Nam. Bạn có thể tận dụng các ưu đãi hoàn tiền khi đặt vé xe khách và các ưu đãi vé tuyệt vời trên nhiều tuyến xe khách khác nhau cho hành trình xe khách của bạn.   </Typography>
        <Typography className="button59"> Áp dụng mã giảm giá VeXeOnlineVeXeOnline khi thanh toán xe buýt và tiết kiệm tới 90% khi đặt vé xe khách. Bạn có thể tận dụng các ưu đãi đặt xe khách trực tuyến cho tất cả các điểm đến trên khắp Việt Nam.
        </Typography>
        <Typography className="button59"> VeXeOnline cung cấp các ưu đãi đặt xe khách vào phút chót và mã giảm giá tốt nhất giúp bạn tiết kiệm tiền ngay trước khi đi đến bất kỳ điểm đến nào. </Typography>
       </Box>
      </Box>

      <Box sx={{margin:'15px', border: "0.5px solid #ffffff", backgroundColor:'#f4f4f4', borderRadius: "8px",}}>
       <Box sx={{width:'95%', margin:'auto', display:'flex', flexDirection:'column', }}>
        <Typography className="button58" sx={{textAlign:'left', marginTop:'20px'}}>Bạn có thể tận dụng nhiều ưu đãi khác nhau khi đặt vé xe khách</Typography>
        <Typography className="button59">VeXeOnline cung cấp nhiều ưu đãi đặt xe buýt khác nhau cho du khách để tiết kiệm tiền khi đặt xe khách trực tuyến. Du khách có thể áp dụng mã phiếu giảm giá trong quá trình thanh toán khi đặt vé xe khách trên VeXeOnline.
             </Typography>
        
        <Typography className="button59">VeXeOnline ưu tiên sự hài lòng của khách hàng và cung cấp cho bạn những ưu đãi tốt nhất khi đặt xe khách. Vì vậy, không còn phải lo lắng về ngân sách du lịch của bạn nữa. Tận dụng các ưu đãi giảm giá, mã phiếu giảm giá, ưu đãi hoàn tiền tốt nhất khi đặt vé xe khách để tiết kiệm tiền. Tận hưởng chuyến đi cùng gia đình và bạn bè. Nhận ưu đãi xe khách tốt nhất ngay hôm nay bằng cách đặt vé trên VeXeOnline. </Typography>
        <Typography className="button59"> Ưu đãi cho người dùng mới: Nếu bạn là người dùng mới của VeXeOnline hoặc đặt vé lần đầu tiên, bạn sẽ được hưởng mức giảm giá dành cho người dùng mới khi đặt vé xe khách.
        </Typography>
        <Typography className="button59"> VeXeOnline cung cấp các ưu đãi đặt xe khách vào phút chót và mã giảm giá tốt nhất giúp bạn tiết kiệm tiền ngay trước khi đi đến bất kỳ điểm đến nào. </Typography>
        <Typography className="button59"> Ưu đãi hoàn tiền: VeXeOnline khuyến khích người dùng sử dụng ví PayOS bằng cách cung cấp tiền hoàn lại cho vé xe buýt được mua trên nền tảng. Tiền hoàn lại đó có thể được sử dụng cho các lần đặt vé xe buýt trong tương lai của bạn, có thể được đổi tùy theo từng lần đặt vé xe khách cụ thể.
        </Typography>
        <Typography className="button59">Ưu đãi đối tác thanh toán: Đội ngũ đối tác của VeXeOnline nỗ lực mang đến những ưu đãi tốt nhất do các đối tác thanh toán như Pay ... và nhiều đối tác khác cung cấp.
        </Typography>
        <Typography className="button59">Lên kế hoạch đặt chỗ sao cho bạn nhận được lợi ích tối đa từ các ưu đãi của VeXeOnline. Kiểm tra điểm đến yêu thích của bạn để du lịch vòng quanh Việt Nam và áp dụng mã giảm giá khi đặt chỗ trên trang web VeXeOnline hoặc Ứng dụng di động để tận dụng ưu đãi.
        </Typography>
        <Typography className="button58" sx={{textAlign:'left', marginTop:'20px'}}>Hỗ trợ khách hàng 24/7</Typography>
        <Typography className="button59">Bạn có thể liên hệ với bộ phận hỗ trợ khách hàng của VeXeOnline để được giải đáp mọi thắc mắc hoặc câu hỏi liên quan đến ưu đãi vé xe buýt, đặt vé trực tuyến. Đội ngũ hỗ trợ khách hàng của VeXeOnline luôn sẵn sàng hỗ trợ bạn 24/7. Bạn có thể liên hệ với chúng tôi qua số điện thoại 0326923816 - 0911513297 về bất kỳ vấn đề nào liên quan đến đặt vé trên AbhiBus.
        </Typography>
       </Box>
      </Box>

    </Box>
  </Box>
  );
};


export default Sale;

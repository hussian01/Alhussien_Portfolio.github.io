const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
// يتم اختيار المنفذ 3000 أو المنفذ المحدد من قبل بيئة الاستضافة
const PORT = process.env.PORT || 3000;

// 1. إعداد الملفات الثابتة (لتقديم HTML, CSS, JS, Assets)
// هذا يخبر الخادم أن كل شيء في المجلد الحالي هو ملف ثابت يمكن للمتصفح الوصول إليه
app.use(express.static(path.join(__dirname, '/'))); 

// 2. إعداد قراءة بيانات النموذج
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =========================================================
// 3. معالجة طلب النموذج (POST Request)
// =========================================================
app.post('/submit-order', async (req, res) => {
    // استقبال البيانات من النموذج (باستخدام أسماء الحقول التي وضعناها في order.html)
    const formData = req.body;
    
    // =======================================================
    // إعداد Nodemailer (يرجى قراءة ملاحظة الأمان أدناه)
    // =======================================================
    // في ملف server.js
    let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'hussiand.s.01@gmail.com', // هذا هو الإيميل الصحيح
        // **ضع كلمة المرور الجديدة المكونة من 16 حرفاً هنا**
        pass: 'ocwi fslf znub ocli' // يجب أن تستبدل هذا بالكلمة التي أنشأتها
    }
});

    // تنسيق رسالة الإيميل
    const emailText = `
        ** طلب خدمة جديد عبر الموقع **
        =================================================
        نوع الخدمة: ${formData.service_type || 'باقة غير محددة'}
        الاسم / الشركة: ${formData.client_name}
        البريد الإلكتروني: ${formData.client_email}
        عنوان الفكرة: ${formData.idea_title || 'لا يوجد'}
        
        ** شرح المتطلبات **
        -------------------------------------------------
        ${formData.details}
        -------------------------------------------------
        
        الميزانية التقديرية: ${formData.budget || 'لم يتم التحديد'}
        
        -------------------------------------------------
        للتواصل الفوري عبر واتساب: +9647737173482
    `;

    // إعدادات رسالة الإيميل
    let mailOptions = {
        from: 'hussiand.s.01@gmail.com',
        to: 'hussiand.s.01@gmail.com', // الإيميل الذي سيستقبل الطلبات
        subject: `طلب جديد: ${formData.client_name} - ${formData.service_type}`,
        text: emailText
    };

    // إرسال الإيميل
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        // إعادة توجيه المستخدم إلى صفحة 'تم بنجاح' (افترض وجودها)
        // يجب أن تنشئ ملف success.html لعرض رسالة النجاح بشكل جميل
        res.redirect('/success.html'); 
        
    } catch (error) {
        console.error('Error sending email:', error);
        // إعادة توجيه إلى صفحة خطأ أو رسالة خطأ
        res.status(500).send('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.');
    }
});


// 4. تشغيل الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
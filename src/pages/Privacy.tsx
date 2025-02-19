import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';

export function Privacy() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    hover: {
      scale: 1.5,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16
    }
  };

  return (
    <>
      <Helmet>
        <title>Политика конфиденциальности | NEPERSONAJ</title>
        <meta name="description" content="Политика в отношении обработки персональных данных" />
      </Helmet>

      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
      />

      <Header cursorVariant={cursorVariant} setCursorVariant={setCursorVariant} />

      <div className="min-h-screen bg-[#0A0A0F] py-32">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          >
            Политика конфиденциальности
          </motion.h1>

          <div className="max-w-3xl mx-auto prose prose-invert">
            <h2 className="text-2xl font-bold text-[#00ff8c] mb-8">
              Политика в отношении обработки персональных данных
            </h2>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Общие положения</h3>
            <p>
              Настоящая политика обработки персональных данных составлена в соответствии с требованиями 
              Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок 
              обработки персональных данных и меры по обеспечению безопасности персональных данных, 
              сайтом nepersonaj.ru (далее – Оператор).
            </p>
            <p>
              Оператор ставит своей важнейшей целью и условием соблюдение прав и свобод человека и 
              гражданина при обработке его персональных данных, в том числе защиты прав на 
              неприкосновенность частной жизни, личную и семейную тайну.
            </p>
            <p>
              Настоящая политика Оператора в отношении обработки персональных данных (далее – Политика) 
              применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта 
              https://nepersonaj.ru/.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Основные понятия</h3>
            <p>
              2.1. Автоматизированная обработка персональных данных – обработка персональных данных с 
              помощью средств вычислительной техники;
            </p>
            <p>
              2.2. Блокирование персональных данных – временное прекращение обработки персональных данных 
              (за исключением случаев, если обработка необходима для уточнения персональных данных);
            </p>
            <p>
              2.3. Веб-сайт – совокупность графических и информационных материалов, а также программ для 
              ЭВМ и баз данных, доступных по адресу https://nepersonaj.ru/;
            </p>
            <p>
              2.4. Обработка персональных данных – любое действие (операция) или совокупность действий с 
              использованием автоматизации или без с персональными данными;
            </p>
            <p>
              2.5. Персональные данные – любая информация, относящаяся прямо или косвенно к Пользователю 
              веб-сайта https://nepersonaj.ru/.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Обрабатываемые данные</h3>
            <p>Оператор может обрабатывать следующие персональные данные Пользователя:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Фамилия, имя;</li>
              <li>Электронный адрес;</li>
              <li>Номера телефонов;</li>
              <li>Номера и логины telegram и whatsapp;</li>
              <li>Иной метод связи который укажет пользователь;</li>
              <li>Также на сайте происходит сбор и обработка обезличенных данных о посетителях (включая файлы cookie).</li>
            </ul>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Цели обработки персональных данных</h3>
            <p>
              4.1. Цель обработки персональных данных Пользователя — информирование посредством 
              электронных писем;
            </p>
            <p>
              4.2. Оператор может отправлять уведомления о новых продуктах, услугах, специальных 
              предложениях. Пользователь может отказаться от получения писем, отправив письмо на 
              электронный адрес support@nepersonaj.ru с пометкой "Отказ от уведомлений".
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Правовые основания обработки</h3>
            <p>
              5.1. Оператор обрабатывает персональные данные только при их самостоятельном заполнении 
              Пользователем через формы на сайте https://nepersonaj.ru/. Заполняя формы, Пользователь 
              даёт согласие на обработку персональных данных;
            </p>
            <p>
              5.2. Оператор обрабатывает обезличенные данные при наличии разрешения на сохранение cookie 
              в настройках браузера.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Порядок обработки данных</h3>
            <p>
              6.1. Оператор принимает все меры для защиты персональных данных от несанкционированного 
              доступа;
            </p>
            <p>
              6.2. Персональные данные Пользователя не будут переданы третьим лицам, за исключением 
              случаев, предусмотренных законодательством;
            </p>
            <p>
              6.3. Срок обработки персональных данных не ограничен. Пользователь может в любой момент 
              отозвать своё согласие на обработку данных, отправив уведомление на электронный адрес 
              Оператора support@nepersonaj.ru.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Трансграничная передача данных</h3>
            <p>
              7.1. Передача персональных данных на территорию иностранных государств возможна только при 
              наличии достаточной защиты прав субъектов данных;
            </p>
            <p>
              7.2. Передача данных в страны без надлежащей защиты возможна только с согласия 
              Пользователя.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Заключительные положения</h3>
            <p>
              8.1. Пользователь может обратиться за разъяснениями по вопросам обработки данных по 
              электронной почте support@nepersonaj.ru;
            </p>
            <p>
              8.2. Политика может быть обновлена, и актуальная версия доступна по адресу 
              https://nepersonaj.ru/privacy.
            </p>

            <h3 className="text-xl font-bold text-[#00ff8c] mt-12 mb-6">Контактная информация</h3>
            <p>По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:</p>
            <p>Telegram: @smmbro24</p>
          </div>
        </div>
      </div>
    </>
  );
}
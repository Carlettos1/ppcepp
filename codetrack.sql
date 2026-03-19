-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 18, 2026 at 06:00 PM
-- Server version: 12.2.2-MariaDB
-- PHP Version: 8.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `codetrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

CREATE TABLE `answer` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `answer` text NOT NULL DEFAULT '',
  `grade` text NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cheat_log`
--

CREATE TABLE `cheat_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` text NOT NULL,
  `context` text NOT NULL,
  `timestamp` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cheat_log`
--

INSERT INTO `cheat_log` (`id`, `user_id`, `action`, `context`, `timestamp`) VALUES
(1, 1, '0', 'focus perdido', '2026-03-18'),
(2, 1, '0', 'focus vuelto: 2400.12 segundos', '2026-03-18'),
(3, 1, '0', 'focus perdido', '2026-03-18'),
(4, 108, '0', 'focus perdido', '2026-03-18'),
(5, 108, '0', 'focus vuelto: 25.536 segundos', '2026-03-18'),
(6, 108, '0', 'focus perdido', '2026-03-18'),
(7, 108, '0', 'focus vuelto: 19.301 segundos', '2026-03-18'),
(8, 108, '0', 'focus perdido', '2026-03-18'),
(9, 108, '0', 'focus vuelto: 31.799 segundos', '2026-03-18'),
(10, 108, '0', 'focus perdido', '2026-03-18'),
(11, 108, '0', 'focus vuelto: 206.309 segundos', '2026-03-18'),
(12, 108, '0', 'focus perdido', '2026-03-18'),
(13, 108, '0', 'focus vuelto: 11.661 segundos', '2026-03-18'),
(14, 108, '0', 'focus perdido', '2026-03-18'),
(15, 108, '0', 'focus vuelto: 3.571 segundos', '2026-03-18'),
(16, 108, '0', 'focus perdido', '2026-03-18'),
(17, 108, '0', 'focus vuelto: 4.606 segundos', '2026-03-18'),
(18, 108, '0', 'focus perdido', '2026-03-18'),
(19, 108, '0', 'focus vuelto: 26.973 segundos', '2026-03-18'),
(20, 108, '0', 'focus perdido', '2026-03-18');

-- --------------------------------------------------------

--
-- Table structure for table `exam_time`
--

CREATE TABLE `exam_time` (
  `teacher_id` int(11) NOT NULL,
  `start_time` bigint(20) NOT NULL,
  `end_time` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_time`
--

INSERT INTO `exam_time` (`teacher_id`, `start_time`, `end_time`) VALUES
(1, 1774002600000, 1774008600000),
(108, 1773865920000, 1773867000000);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL DEFAULT '',
  `question` text NOT NULL DEFAULT '',
  `example` text NOT NULL DEFAULT '',
  `prepend` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `title`, `question`, `example`, `prepend`) VALUES
(1, 'pregunta 1', 'pregunta', 'hola', 'print(\"si\")');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_question`
--

CREATE TABLE `teacher_question` (
  `teacher_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_question`
--

INSERT INTO `teacher_question` (`teacher_id`, `question_id`) VALUES
(108, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `superuser` enum('0','1','2') NOT NULL DEFAULT '0',
  `teacher` int(11) NOT NULL DEFAULT 0,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `superuser`, `teacher`, `password`) VALUES
(1, 'admin', '2', 0, '$2a$10$5OryatMIvZZJw4ntwGGv6efQmPhdLZAI5JjAl0Rwpbj3VhIC8IOJ2'),
(3, 'c.loyolacanales', '1', 0, '$2a$10$KUTIvbZVeMWfcY9hnznTcuXRkvx7pfDd3jyUjfs9/MVfLiV5dc.mG'),
(4, 'l.ibacachecea', '0', 3, '$2a$10$JsvOZpNxZ9ZeERHCfAXijOHjX2i6mwAHv14aL5seObk3DYLhrBjPi'),
(5, 'a.aguileraromero', '0', 3, '$2a$10$zKlmF5b82JYx1GQwmZTlGuxhK01c9gpvSX0P15BJm9LF0wcDPDLCC'),
(6, 'o.alamoziga', '0', 3, '$2a$10$/TFZvtGYaiYNRUDqz9KXsuM9bs3p4cXal7pjzPGh44/ogHFbNqBWS'),
(7, 'm.arenasmuoz1', '0', 3, '$2a$10$XqT58K1TgpcCileecsWyE.9VJlRNEqxJCE6e.FNQWoC3Yayb26C1a'),
(8, 's.bravodiazdevaldes', '0', 3, '$2a$10$Cqkbt.tHVpfGB/zxQKytWemDk7g75XV4YXu.Nk4f5YhyTWwHZaq7G'),
(9, 'a.dazjofr1', '0', 3, '$2a$10$JosLNUqMaiJPwLa9Kz0kj.JcPlmgrqtn/F.zm0fJh2JqvKWDVfQoG'),
(10, 'a.dazlemus', '0', 3, '$2a$10$1MOOPaqN.hU6Yp2V3pcvSuKgOhDAP7VX5ieDLZKzpq9USH7Ctt1am'),
(11, 'c.fernandezgarrido2', '0', 3, '$2a$10$F8R7zsyY48DFFv5joweUIuCwxL664cFuLSG27FB8cFjjnTpc7NUpG'),
(12, 'd.fernandezderetanaa', '0', 3, '$2a$10$76u5KbjfdFqOb/lwQG7ro.C9evkgUsbc/K4pM8RIbX3Izgt2xVehm'),
(13, 'b.gajardovargas', '0', 3, '$2a$10$wuB3ZP1tPU/gY1n2nvEa1.yyL4ngGZlfWNe70601LGnDWnuiBvmwK'),
(14, 'l.lopezahumada', '0', 3, '$2a$10$xOLtRKSQlFC7xkuIrQsMluTkz43Pkk2nsrLvPVgaXqYyUPwA0LD6a'),
(15, 't.maldonadoclavel', '0', 3, '$2a$10$wkSqW7eZVzbtLKGNwRUcAuuAPvpPkWyRHUOjw67J9eyFok17mqQ16'),
(16, 'l.maranguniclausic', '0', 3, '$2a$10$QgIuYZDK4Gx81jZl3BabqOeUoOiploMqGlsCYLYz1x9zvKEa3TV1q'),
(17, 'g.osoriofaundez', '0', 3, '$2a$10$d9S8JvODcvmrRSx7sPvZve84JqynSJElWsv1Qzw.5DHiAWXq/z1d6'),
(18, 's.ramireztrujillo', '0', 3, '$2a$10$BOc/RjBlRMDO.XjJOJOENOm1kt10no8JVPETB48w.F5O4ciQ7.d6a'),
(19, 'm.rivasriveros', '0', 3, '$2a$10$r2QXnDmdBJSx6KC5dUJYhebquLl0M2YhqT7f.cpOeke5Av7sbc5pu'),
(20, 'h.rojastapia', '0', 3, '$2a$10$.JMDyTT8lAKV6SxRpDOCruDNLTR/aQbr0AvirOzGLWs2E779PxtDe'),
(21, 'm.silvalataillade', '0', 3, '$2a$10$gFEKMUOljZ9n7iFcCFG6j.AMB2iFA5HSK1pq0BCUwa4As07hiZei6'),
(22, 'a.snchezalbornoz', '0', 3, '$2a$10$phL.Yosd.ggtno8yEc5qeOShu0lz8xHEQjEeqOCZ4teMZMt/PKoje'),
(23, 'v.vegacornejo', '0', 3, '$2a$10$dcfoWkyO7alkPwNFoMGndubeCP6wcmE6/tyLac09mRgfJ8OnGOiui'),
(24, 'd.vilcatueros', '0', 3, '$2a$10$1/neFDFS5/B0AdxaDh9Xbe3AWe7hz6sY.X5y2CWFkwdWegOZTlmyG'),
(25, 'n.delavegapastn', '0', 3, '$2a$10$.pY48jRjseYYb92au8zX8.LiH1.SFHeDN9XlIkTl576ryAhuK7yCG'),
(26, 'c.lvarezbarrientos', '0', 3, '$2a$10$.xI6VaW39Ie9AkCG662zOOYMb88tmlRQqi8EZeNVdB86E2GQWoii6'),
(27, 'c.ruizvergara', '1', 0, '$2a$10$FV4HPrceTlsrdFdlirk2Je.iE32ZZvk5.M1Ir/zMdm0i5/Wapf.R2'),
(28, 'f.fuentesaguilera', '0', 27, '$2a$10$nSSQneXS0zwoAqTBC7cs8OZAqEFxg3haxO8RdpmdQq8xFBVpbZqwa'),
(29, 'b.alfarochagay', '0', 27, '$2a$10$C7BCaK0X/SliaV.hgln50.ALTJj3aNAHeJ4q9uAp8bPlwWIYJqZfy'),
(30, 'm.arancibiavidal1', '0', 27, '$2a$10$HiGEubIUbjHK8gHdk7.NTuPe1CJSH0IIa.chxptsvashyZjK5j2Um'),
(31, 'c.avilaaravena', '0', 27, '$2a$10$SkPlmXlovzFi8OhgbeQT1egS8hX8JabU/RcjpR7WhLZSS7lp70iVK'),
(32, 'm.baezaotrola', '0', 27, '$2a$10$mk94v27vJL1B04RG5WAuMODgMCSZsS9c2lhJiF4KsQW4/SkdvdOS6'),
(33, 'r.fuenzalidatamayo', '0', 27, '$2a$10$AJ4AWrecOYnkQQ6UjdEYRecItfFqp5kJRkwQOkrer7/MOr5fEi2Nq'),
(34, 'r.caballeroseplveda', '0', 27, '$2a$10$z1HM.TTGV14cnPZnj60ERudemOoJ0iPHH.FsI7SDv/WdJwqxsUpqy'),
(35, 'g.cabezasahumada', '0', 27, '$2a$10$wxLFzVO4StRSaIBiBZtbl.FLJYowpu9AMlAByJCIqqnUTn3IuGEfK'),
(36, 'b.camposmejas', '0', 27, '$2a$10$bZt2QRzmdcYKh0pDB//FbeX42MSnJq0IGPzFLQAtu3xCgza4l420a'),
(37, 'f.contrerasmuoz', '0', 27, '$2a$10$JJXGNm9ZyWNIzCQmmiONZuRFZ3LJb.mCvwjpMNHw1LU5tVZ4wke8a'),
(38, 'o.escobarrodrguez', '0', 27, '$2a$10$MrnoY8m1Xfju4gM0r8yzTeJHjuNmfL1/MgSipBOyCkO6GzIl0F4le'),
(39, 'f.galvezlpez', '0', 27, '$2a$10$c1HY3yWZO7y.tSxmVwVuwuWbEG2e.6NREUxqwcWzLA3fIXrNhiUDW'),
(40, 'f.garridosubiabre', '0', 27, '$2a$10$YEABmtxQBf7YMLV.ZYPd4OE3LoEweHOAqeZL6USVlAaqjC.bWz/XK'),
(41, 'i.godoyfigueroa', '0', 27, '$2a$10$8JGc1DAmOCvDJ9MCvZLtzOveXyrte.mKjf3OS3O27/ppZvQhyiJOa'),
(42, 'c.gratemonilla', '0', 27, '$2a$10$afgL7atmNLTYby47wBRafOnno7d05GNodduLbcf06J7ifyazjYg3i'),
(43, 'm.krutmeyerrivas', '0', 27, '$2a$10$ZuYh0KcB9OkTWJFrJvkcLuni1CcvF9sOFUyH6tdCmiO/eSYQrI.4O'),
(44, 'v.lagosvergara', '0', 27, '$2a$10$bkOryzw95c47u4vN8.vbae29CRNHePkNEJFFwJza6gWdr.0CVgHEu'),
(45, 'j.maureirabelmar', '0', 27, '$2a$10$b31jtIJQ0juKWeR2vaD9OeLzMu.knYBbxGWHpAG6mM6c/0xNRaJSe'),
(46, 'm.mirandamolina1', '0', 27, '$2a$10$yLfQrBvfJTHfTXpHuvtx3e5PhO/9kfWPLDdNoJ1DDonbVw91CwxOK'),
(47, 'm.moralesvilla', '0', 27, '$2a$10$bUh/yk2ZlVI4ROwr/vzE2OFF.BL0ShzvQbpQrQmUgypkFM7ahf63.'),
(48, 'g.naguelqunmercado', '0', 27, '$2a$10$7Pn2Vsk8vg6uyUujFHKP0eMWxW0ibiydlaWMyeWhq/al74OROnohC'),
(49, 'z.narvaezarellano', '0', 27, '$2a$10$Jf1KCbKNTboDMpe/J8AjEep11LOtAinNJOXwhXJhGAal5yzHj8Zom'),
(50, 'c.pizarrovaras1', '0', 27, '$2a$10$KpyAf0QQOT8eCkRdr2.e1uyX4j7FgGuUM4FPqZ3dizVDBFDtRFDEG'),
(51, 'm.prezseplveda1', '0', 27, '$2a$10$d65a9.8c.AyCohjvRaydqOvx4QSGcJxryfPrkvIyTvvJnxJEsvV3O'),
(52, 'm.quintunpizarro', '0', 27, '$2a$10$glWXmM2ran0nMTj9/VgZkuztoDUTLSzaL6MAiE0eddndut00cVqZ.'),
(53, 'j.riveraecheverria', '0', 27, '$2a$10$hcfD6jj6cZKbGsEPFip27OTrg4V0lTVKerxH1QZIj/Jj2ivSeno9u'),
(54, 'j.romeroamaya', '0', 27, '$2a$10$xpqTiL4J7j4Bh74Lyd4xjuaKbOVsxvZj0nDC/JttFp7Ofo52cqwzG'),
(55, 's.saavedralvarez', '0', 27, '$2a$10$Z4V1S7HVaLTjfYjTUJcw0eH.o2bTG4sMCLGHubEeG6RZPS2ts4Wc.'),
(56, 'a.snchezniodezepeda', '0', 27, '$2a$10$x72EFudvbQz6ncD4tAUSTe0cWaZuCDoydBT8uYp455GngthyhPo1u'),
(57, 'm.torresmartnez', '0', 27, '$2a$10$h/Lz3sMSjpO.CEVwuL/D7u5cjxZt6fq/MbVtenKzh8I3M1BYCjOs6'),
(58, 'm.valdsrojo', '0', 27, '$2a$10$ia0YUOskDds7q2H1mD41a.0pFMyfpOZg.fv9qscKDtna/kShLysd2'),
(59, 'l.zuloagagmez', '0', 27, '$2a$10$M2NupuEiYTC4zMRjkA8d0OgY6596Vw4UBzYr4rRDRDWGafpeT3/dG'),
(60, 'd.garcavenegas', '1', 0, '$2a$10$sG/5XSx.g.3fhUeHO1Uo0OSRdLS00sbFIpvDms4TEqVrgGyqgH4XK'),
(61, 'p.lepesaavedra', '0', 60, '$2a$10$9Z3vrBbq0TecePJ12.zHf.zskeO8CNiqi09DZrDwDJKkAuMLemaiW'),
(62, 'f.aguirreosorio', '0', 60, '$2a$10$WIcip7h85GMQVuOAxwanO.8G59R5G3JHHSGegPxNQFrWEfX7vlJ3q'),
(63, 'v.aravenagmez', '0', 60, '$2a$10$YLSgRdl70NerVgWH8y3K2uD4rZ47DpPGxzCZ3NnAKzVwrSEjPNYDy'),
(64, 'j.ayaupandaz', '0', 60, '$2a$10$XE9I8GbIS5y5QESjee44tugTnFw20PrJBcpgKtrAMu.EtgA8guSze'),
(65, 'c.bassoburgos', '0', 60, '$2a$10$Z3Js8oWsA/66eF5dB2W2jOyTOYMce2bp64zOzdx4S3dZtDbgmqa6a'),
(66, 'f.estradacosta', '0', 60, '$2a$10$DswQPeImPudiUpWV3RW0TO.YrVd7pbs9Ig/SAMoiK.s2IOZWHNFB2'),
(67, 'a.guerracorvaln', '0', 60, '$2a$10$HfObA7Mo1aCpqOpDzxfXWuAR6C/jlQCDuA0Tl72YGzbNzY9U0ZdNm'),
(68, 'd.lpezsandoval', '0', 60, '$2a$10$9GQYjqQfilaAX3Q/t3e4Ge6csZYTd7ipqQAdWwMclKVROYUMjxenu'),
(69, 'a.leytonbecerra', '0', 60, '$2a$10$X2hi5erBqNQMHsfSbNvU5O4UNLHUzQUCE1UgCxCAfQOhwoPglEKdm'),
(70, 'i.lewinnovoa', '0', 60, '$2a$10$Fnwr8W6Uih5Z1vfLlwtWy.Zzbj9u/bxpfsoJHXazD1i7BY3YSPTaa'),
(71, 'n.lafuenteseplveda', '0', 60, '$2a$10$22hLRv.78DRXBDIJyJEl5eDEoKXqRgCJg8ovhVeE4gDqgeq2CD2zW'),
(72, 'y.hernndezgarrido', '0', 60, '$2a$10$21QltjVQo3JD6LTt9tvaD.6rUvdSZbWrWrBM8OuxjPFO./xpXwXj.'),
(73, 'q.gutierrezvalencia', '0', 60, '$2a$10$MHkitbLTVexRKyV9J7Xs5OfPHyz1WoT36gEDwcM6g.nvhgVFtWoHi'),
(74, 'm.marileocontreras', '0', 60, '$2a$10$HN.cjD6/WH/t.EfJax6XdOKV3EjCnEkzP39NbDsA954IzTwqsi8p2'),
(75, 's.medinainostroza', '0', 60, '$2a$10$fr/q6cZ6oyjImMygoNkMp.J1PX6BhNmsgO.NgfdJxYnT7j7GP0It2'),
(76, 'p.medinarojas', '0', 60, '$2a$10$MFTka6a0GA5cWLBlnadV9OEihDIenNle53.0CDx9/nGuMO7P2tW7G'),
(77, 'j.mirandamarinao', '0', 60, '$2a$10$UVmRyMemBJH4TQ0xqfexiOFGa93RbZ03X9a4ULRgei7nTdrMhUBti'),
(78, 'i.morenomuoz', '0', 60, '$2a$10$vz6/HfvNxJUJjDCm1Y21P.U5dZNcbdv8IKk2DU7xQ/gI8R4b014Y2'),
(79, 'r.muozaraneda', '0', 60, '$2a$10$CPDOF6GSFkoxOJUT41PUS.a.5WKwrER2IQfvI61eI0r06HLzh6kQO'),
(80, 't.navarrohrepich', '0', 60, '$2a$10$LLeU8RBunza1NfAORtUxpOK3VzJJrnvh400xX/TKmkO6OMyqmlGNO'),
(81, 'a.pereiramedina', '0', 60, '$2a$10$u8KER8ceJ7zCc2QrvStSR.bDmAKAzUsALAe1dRgLeHrj7ujrYcAIe'),
(82, 'f.pealozaquezada', '0', 60, '$2a$10$YNEfX7Qei4VnDlQ6CNbYcuVCHF6yGxCTAkCW22H.EtIJrntLkwehC'),
(83, 'c.ramosvivanco', '0', 60, '$2a$10$nJp9UchIdROBFEVL9qJLLuFiy4rXYizYV0T1PEyFt9H.B5oKLwGf.'),
(84, 'm.ramrezgonzlez2', '0', 60, '$2a$10$RBOUgA7rx6mzYupDCSjkYuWu.3mPmoZZ7WBnGBm7jB2sp3xNcJacC'),
(85, 'm.riquelmesalinas', '0', 60, '$2a$10$4Kdv810KmlH5.5JCrRpgme5kHSBVCDFR3FisiMws6AGEs6HyfAXWG'),
(86, 'c.roedahlriquelme', '0', 60, '$2a$10$2Oc3hhNC8VLjFHypfffHhO7zLodqyAM6yeR423XAKq/Eahf4pbn9a'),
(87, 'a.seplvedavalds', '0', 60, '$2a$10$It49lyYNaj87PlqJQkWgCezXtDYYmE9ikyLDtaqsuXECBLiQezPAu'),
(88, 't.valenzuelalpez', '0', 60, '$2a$10$d2RfXthLBaLxlNAibXZxzOwgKLLZB2cQ64BtutI71F3qVJrfuAQHG'),
(89, 'i.weisserprez', '0', 60, '$2a$10$3BVPRtcpEL.CPQuOSpMWF.GMqs1Qs8xG58m4Pow43jO.9PNEn4wHm'),
(90, 'm.zambranoordoez', '0', 60, '$2a$10$zZ4ndSS97QYq6ZCDdTivdOpj69lRcbq1Z3NCz2MRt9L64ndUyGBDq'),
(91, 'c.femenasmarcos', '1', 0, '$2a$10$ZXESI730lbE2e4.Je7ZyaObmmohqrRmHHGDsEZzIc9BVxgNjMB14C'),
(92, 'c.cortezvsquez', '0', 91, '$2a$10$PGDRYO39wSrHGi7RtBuj7u27EubLN4OTCkjo.hB6J8RE.Go6BEQlq'),
(93, 'c.aranaurdaneta', '0', 91, '$2a$10$4f5BmQQAsuHQEXNV0JXZCukE.ubjtm0CuHOx6Cv61uRKT7Kz3p3a2'),
(94, 'a.contrerasvallejos', '0', 91, '$2a$10$knNXWffHjebPEZ4RgPSAwuxBZBc7DuIIvs0Cb5h4QQ70euwkfEkJO'),
(96, 'm.matusvaldivia', '0', 91, '$2a$10$.itoMk4j/JZ3FN6cm44ll.Jv61yOISkJfxv3HpnwWEx.7jPfBkZjm'),
(97, 'a.molinaguzman1', '0', 91, '$2a$10$fKRgqsm1wWfLb8z3QMSBuO0whLtoTNsKfK4VwMyYhzmP6ncr7uC1K'),
(98, 'd.ortizramos', '0', 91, '$2a$10$5ITj3O3AhCZ4EQJGDEA4suTTydCAP3SQcVarZFPhMboB58jtda.h2'),
(102, 'm.arancibiapalma', '0', 91, '$2a$10$/CKOZ9d2yx4hi85Cd2gMreZR6VwJk8qfiss3J9yMrTi5Jcs5Sy2MO'),
(108, 'sandro.villanova', '1', 0, '$2a$10$JkQZvaETtxwC5LKkoYHSr.c157oQrUlO7LowsXCEBJRhwoacMPsx.'),
(109, 'i.sotocarrasco', '0', 108, '$2a$10$t/gDFC7DG1uikDzE.zjCtu3MO8B/4juVy0KV1fRN82umV7G.RILZ6'),
(110, 'a.acevedobozo', '0', 108, '$2a$10$hAKaMZi75/vQtJa6y5mmfu3VClOQDmHVfYB35uzgj/jYSDqSdHyNC'),
(111, 'c.arvaloreyes', '0', 108, '$2a$10$YXrJtTLOWI0ktafn6h39iu4vjOn3eTS1kLrXkSXdhr6ReqxpB98C.'),
(112, 'a.contreraspinto1', '0', 108, '$2a$10$/jhf1QYb44RP4qsDRGhzhOzvAXPgY8bzxZ.fLNJfXTa5OOKe6D/7.'),
(113, 'm.gonzleznez6', '0', 108, '$2a$10$gGN.yAnOpm1kGOjsjfgU0.bqG/eADDMg/tCPLbATJZE4L4xcmChgG'),
(114, 'i.suilhermosilla', '0', 108, '$2a$10$mzSBOiOb1jXvXDufW5/I.OmthbvFd0BVnFBtApQtw3HCgsmJMb49q'),
(115, 'l.quinteroflores', '0', 108, '$2a$10$xfmXSuJg0jZE6RPHVyzvEuzs5Pe/Hk9h3fRLpEVzzxJsWvm4CgRsG'),
(116, 'e.portillocarrasco', '0', 108, '$2a$10$hhZ9N8ga6Gfa7hVCkxK3G.zXHs3pygqdy1PeokPHzwmg9p1Ob1LXC'),
(118, 'c.gonzlezaravena1', '0', 108, '$2a$10$b/Phc.WrBhUNkwzKt/U5xu54.IPUWSSVxTYpUgWFGbK0nodg3QamS'),
(119, 'l.sotovielma', '0', 108, '$2a$10$2p7Ooh5M7HHHGHjePiE7feYGGHjvDWWbJvi2QaRZEKDyM/Vux/clK'),
(120, 'j.robleroprez', '0', 108, '$2a$10$zsjlE3djqypM9olGNDxID.hqy6SxKJDz2n14kzEJ2dVQjO6zbrhw.'),
(128, 'a.lpezgmez1', '0', 108, '$2a$10$Zr19n7A/W45rxQhXpCW/ReOSFonqslBNTeoKehDH7XevPf4qKgEjG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cheat_log`
--
ALTER TABLE `cheat_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_time`
--
ALTER TABLE `exam_time`
  ADD UNIQUE KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teacher_question`
--
ALTER TABLE `teacher_question`
  ADD UNIQUE KEY `teacher_id` (`teacher_id`,`question_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer`
--
ALTER TABLE `answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cheat_log`
--
ALTER TABLE `cheat_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

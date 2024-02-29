import { locales } from "../locales";
import { creditCardStatuses, requisitionStatusConst } from "../../utils/consts.util";

export default {
  [locales.RUSSIAN]: {
    cardNumber: "Номер карты",
    wallet: "Кошелек",
    email: "Электронная почта",
    expiryMonth: "Месяц",
    expiryYear: "Год",
    cardHolder: "Имя Фамилия",
    cardHolderCountry: "Страна проживания",
    cardHolderCity: "Город проживания",
    cardHolderDOB: "Дата рождения",
    cityId: "Город",
    internal: "Внутренняя сеть",
    external: "Внешняя сеть",
    networkId: "Сеть",
    address: "Адрес пункта выдачи",
    name: "Название пункта выдачи",
    description: "Описание пункта выдачи",
    cashierId: "Менеджер пункта выдачи",
    exchangePointId: "Пункт обмена",
    referenceId: "Идентификатор заявки",
    contacts: "Дополнительная информация",
    
    [requisitionStatusConst.NEW]: "Новая заявка",
    [requisitionStatusConst.INVOICE]: "Ожидается оплата",
    [requisitionStatusConst.PENDING]: "В обработке",
    [requisitionStatusConst.PROCESSED]: "Оплаченная заявка",
    [requisitionStatusConst.FINISHED]: "Выполнена",
    [requisitionStatusConst.CANCELED]: "Отменена",
    [requisitionStatusConst.DISABLED]: "Закрыта системой",
    [requisitionStatusConst.ERROR]: "Ошибка транзакции",
    [requisitionStatusConst.CARD_VERIFICATION]: "Верификация карты",

    [creditCardStatuses.VERIFIED]: "Верифицирована",
    [creditCardStatuses.NOT_VERIFIED]: "Ожидает верификации",
    [creditCardStatuses.CANCELED]: "Отменена",
    [creditCardStatuses.PAST_DUE_DATE]: "Просрочена",
  },
};

import { ObjectLinkedType } from './object-linked-type.enum';
import titles from '../../../assets/i18n/ru/titles.json';
import { I18nContext } from 'nestjs-i18n';

type LinkedMap = {
  type: ObjectLinkedType;
  text: TextFunction;
  url: (...args: number[]) => string;
};

type TextFunction = (i18n: I18nContext, text: string, includeTitle: boolean) => string;

// проверка на удовлетворение условий. Возможно полифилл для ts 4.9 satisfies
const satisfies =
  <UpType>() =>
  <T extends UpType>(t: T) =>
    t;

const createText =
  (title: `titles.${keyof typeof titles}`): TextFunction =>
  (i18n: I18nContext, text: string, includeTitle: boolean): string =>
    `${includeTitle ? `${i18n.t(title)} ` : ''}${text}`;

export const objectLinkedMap = satisfies<Record<ObjectLinkedType, LinkedMap>>()({
  article: {
    type: ObjectLinkedType.article,
    text: createText('titles.article'),
    url: (id: number) => `/interesting/articles/${id}`,
  },
  celebrity: {
    type: ObjectLinkedType.celebrity,
    text: createText('titles.celebrity'),
    url: (id: number) => `/celebrities/${id}`,
  },
  checklist: {
    type: ObjectLinkedType.checklist,
    text: createText('titles.checklist'),
    url: (id: number) => `/interesting/checklists/${id}`,
  },
  coaching: {
    type: ObjectLinkedType.coaching,
    text: createText('titles.coaching'),
    url: (id: number) => `/interesting/coachings/${id}`,
  },
  course: {
    type: ObjectLinkedType.course,
    text: createText('titles.course'),
    url: (id: number) => `/courses/${id}`,
  },
  courseStep: {
    type: ObjectLinkedType.courseStep,
    text: createText('titles.courseStep'),
    url: (id: number, stepIndex: number) => `/courses/${id}/steps/${stepIndex}`,
  },
  exercise: {
    type: ObjectLinkedType.exercise,
    text: createText('titles.exercise'),
    url: (id: number) => `/exercises/${id}`,
  },
  habit: {
    type: ObjectLinkedType.habit,
    text: createText('titles.habit'),
    url: (id: number) => `/habits/${id}`,
  },
  habitCategory: {
    type: ObjectLinkedType.habitCategory,
    text: createText('titles.habitCategory'),
    url: (id: number) => `/habits/categories/${id}`,
  },
  interestingCategory: {
    type: ObjectLinkedType.interestingCategory,
    text: createText('titles.interestingCategory'),
    url: (id: number) => `/interesting/categories/${id}`,
  },
  letter: {
    type: ObjectLinkedType.letter,
    text: createText('titles.letter'),
    url: (id: number) => `/letters/${id}`,
  },
  task: {
    type: ObjectLinkedType.task,
    text: createText('titles.task'),
    url: (id: number) => `/tasks/${id}`,
  },
});

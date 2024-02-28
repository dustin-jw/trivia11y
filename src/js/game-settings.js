/* globals IS_MULTIPLE_CHOICE GAME_TYPE */
import { getQuestions, getRelevantQuestions, getQuestionsForGame } from './helpers/get-questions';

let questions;

const getQuestionCountForCategory = (questions, categoryName) => {
	const relevantQuestions = getRelevantQuestions(questions, categoryName, IS_MULTIPLE_CHOICE);

	return relevantQuestions.length;
};

const updateQuestionCounts = async () => {
	questions = await getQuestions(IS_MULTIPLE_CHOICE);

	const categoryCountElements = document.querySelectorAll('[data-category]');
	categoryCountElements.forEach((element) => {
		const category = element.dataset.category;
		const count = getQuestionCountForCategory(questions, category);

		element.textContent = `(${count})`;
	});
};

const handleSelectionChange = async () => {
	const questionsForGame = await getQuestionsForGame(questions, IS_MULTIPLE_CHOICE);
	const numberOfQuestions = questionsForGame.length;
	const questionCountElement = document.querySelector('[data-question-total]');
	if (questionCountElement) {
		questionCountElement.textContent = numberOfQuestions;
	}
};

const initializeCategorySelectionChangeListener = () => {
	const elements = document.querySelectorAll('input[name="category"]');
	elements.forEach((element) => {
		element.addEventListener('change', handleSelectionChange);
	});
};

const startGame = async () => {
	sessionStorage.removeItem('questions');
	sessionStorage.removeItem('questionStatus');

	const questionsForGame = await getQuestionsForGame(questions, IS_MULTIPLE_CHOICE);
	const questionOrder = questionsForGame
		.map((question) => `/${GAME_TYPE}/all-questions/${question.pageNumber}/`)
		.sort(() => (Math.random() > 0.5 ? 1 : -1));

	sessionStorage.setItem('questions', JSON.stringify(questionOrder));
	sessionStorage.setItem('currentQuestionIndex', '0');

	window.location.href = questionOrder[0];
};

const initializeFormSubmitListener = () => {
	const form = document.querySelector('[data-game-settings]');
	form?.addEventListener('submit', (event) => {
		event.preventDefault();

		startGame();
	});
};

updateQuestionCounts();
initializeCategorySelectionChangeListener();
initializeFormSubmitListener();
handleSelectionChange();

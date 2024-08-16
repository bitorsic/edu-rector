const toString = (number) => {
	let hours = Math.floor(number / 60);
	let minutes = number % 60;
	return `${hours}:${minutes}`;
}

const toNumber = (string) => {
	let arr = string.split(":"); // arr[0] = hours, arr[1] = minutes
	return arr[0] * 60 + Number(arr[1]);
}
export function isBirthday(today: Date, birthday: Date): boolean {
  return (
    today.getDate() === birthday.getDate() &&
    today.getMonth() === birthday.getMonth()
  );
}

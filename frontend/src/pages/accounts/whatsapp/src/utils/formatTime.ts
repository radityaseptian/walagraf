export default function (timeString) {
  const [hours, minutes] = timeString.split(':')
  return `${hours}:${minutes}`
}

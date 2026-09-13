export function useVapi() {
  return {
    isCalling: false,
    transcript: [],
    error: null,
    startCall: () => {},
    stopCall: () => {}
  };
}

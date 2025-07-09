const abortController = new Map<string, AbortController>()

function createAbortController(key: string): AbortController {
  const controller = new AbortController()
  abortController.set(key, controller)
  return controller
}

function callAbortController(key: string): void {
  if (abortController.has(key)) {
    const controller = abortController.get(key)
    if (controller) {
      controller.abort()
    }
  }
}

function callAbortControllers() {
  abortController.forEach((controller) => {
    controller.abort()
  })
}

function deleteAbortController(key: string): void {
  if (abortController.has(key)) {
    abortController.delete(key)
  }
}
export { createAbortController, callAbortController, callAbortControllers, deleteAbortController }

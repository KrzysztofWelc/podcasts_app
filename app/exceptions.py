class ResourceNotFound(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class OperationNotPermitted(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


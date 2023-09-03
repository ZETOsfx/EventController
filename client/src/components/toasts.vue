<template>
    <!-- Группировка toasts --> 
    <div class="toast-container bottom-0 end-0 p-3">
      <!-- Успешно --> 
      <div class="toast fade text-bg-success" role="alert" id="ToastSuccess" aria-live="assertive" aria-atomic="true" data-bs-delay="10000">
        <div class="toast-header">
          <rect width="100%" height="100%" fill="#007aff"></rect>
          <strong class="me-auto">Успешно!</strong>
          <small class="text-muted"> {{ time }} </small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ successCb }}
        </div>
      </div>
      
      <!-- Ошибка --> 
      <div class="toast fade text-bg-danger" role="alert" id="ToastError" aria-live="assertive" aria-atomic="true" data-bs-delay="10000">
        <div class="toast-header">
          <rect width="100%" height="100%" fill="#007aff"></rect>
          <strong class="me-auto">Произошла ошибка!</strong>
          <small class="text-muted"> {{ time }} </small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ errorCb }}
        </div>
      </div>

      <!-- Инфо --> 
      <div class="toast fade text-bg-info" role="alert" id="ToastInfo" aria-live="assertive" aria-atomic="true" data-bs-delay="10000">
        <div class="toast-header">
          <rect width="100%" height="100%" fill="#007aff"></rect>
          <strong class="me-auto">Уведомление</strong>
          <small class="text-muted"> {{ time }} </small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ infoCb }}
        </div>
      </div>

    </div>
</template>

<script>
    export default {
        props: ['time', 'successCb', 'errorCb', 'infoCb'],
    }
</script>
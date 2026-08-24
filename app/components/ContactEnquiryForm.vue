<script setup lang="ts">
import type { ContactPageContent } from '~/types/content'
import { normalizeEnquiryInterest } from '~/utils/enquiryInterest'
import { enquirySubmissionErrorMessage } from '~/utils/enquirySubmission'

interface EnquiryFormData {
  name: string
  email: string
  phone: string
  organisation: string
  interest: string
  message: string
  consent: boolean
  website: string
}

interface EnquiryResponse {
  success: boolean
  message: string
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

const props = defineProps<{
  content: ContactPageContent['form']
}>()

const route = useRoute()
const config = useRuntimeConfig()
const defaultInterest = 'general-enquiry'
const initialInterest = normalizeEnquiryInterest(defaultInterest, props.content.interests)

function createEmptyForm(interest = initialInterest): EnquiryFormData {
  return {
    name: '',
    email: '',
    phone: '',
    organisation: '',
    interest,
    message: '',
    consent: false,
    website: '',
  }
}

const form = ref<EnquiryFormData>(createEmptyForm())
const submissionState = ref<SubmissionState>('idle')
const statusMessage = ref('')

const endpoint = computed(() => {
  const wordpressUrl = config.public.wordpressUrl.replace(/\/$/, '')
  return `${wordpressUrl}/wp-json/heekmah/v1/enquiries`
})

const isSubmitting = computed(() => submissionState.value === 'submitting')
const submitLabel = computed(() => (isSubmitting.value ? 'Sending…' : props.content.submitLabel))

function getInterestFromQuery(value: unknown): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value

  if (typeof candidate !== 'string') {
    return undefined
  }

  const normalized = normalizeEnquiryInterest(candidate, props.content.interests, '')
  return normalized === candidate ? normalized : undefined
}

function clearStatus(): void {
  if (submissionState.value === 'submitting') {
    return
  }

  submissionState.value = 'idle'
  statusMessage.value = ''
}

async function submitEnquiry(): Promise<void> {
  if (isSubmitting.value) {
    return
  }

  submissionState.value = 'submitting'
  statusMessage.value = 'Sending your enquiry…'

  try {
    const response = await $fetch<EnquiryResponse>(endpoint.value, {
      method: 'POST',
      timeout: 15_000,
      retry: 0,
      body: {
        ...form.value,
        source: route.fullPath,
      },
    })

    if (!response.success) {
      throw new Error('The enquiry endpoint did not confirm the submission.')
    }

    const submittedInterest = form.value.interest
    form.value = createEmptyForm(submittedInterest)
    submissionState.value = 'success'
    statusMessage.value = response.message || 'Thank you. Your enquiry has been received.'
  } catch (error) {
    submissionState.value = 'error'
    statusMessage.value = enquirySubmissionErrorMessage(error)
  }
}

onMounted(() => {
  const requestedInterest = getInterestFromQuery(route.query.interest)

  if (requestedInterest) {
    form.value.interest = requestedInterest
  }
})
</script>

<template>
  <div class="form-card">
    <div class="form-heading">
      <p class="eyebrow">{{ content.eyebrow }}</p>
      <h2>{{ content.title }}</h2>
      <p id="enquiry-form-introduction">{{ content.introduction }}</p>
    </div>

    <form
      class="enquiry-form"
      aria-describedby="enquiry-form-introduction enquiry-form-status"
      @submit.prevent="submitEnquiry"
      @input="clearStatus"
    >
      <div class="field-grid">
        <div class="field">
          <label for="enquiry-name">Name <span aria-hidden="true">*</span></label>
          <input
            id="enquiry-name"
            v-model.trim="form.name"
            name="name"
            type="text"
            autocomplete="name"
            maxlength="120"
            required
          />
        </div>

        <div class="field">
          <label for="enquiry-email">Email <span aria-hidden="true">*</span></label>
          <input
            id="enquiry-email"
            v-model.trim="form.email"
            name="email"
            type="email"
            autocomplete="email"
            maxlength="190"
            required
          />
        </div>

        <div class="field">
          <label for="enquiry-phone">Phone <span class="optional">Optional</span></label>
          <input
            id="enquiry-phone"
            v-model.trim="form.phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            inputmode="tel"
            maxlength="40"
          />
        </div>

        <div class="field">
          <label for="enquiry-organisation">Organisation <span class="optional">Optional</span></label>
          <input
            id="enquiry-organisation"
            v-model.trim="form.organisation"
            name="organisation"
            type="text"
            autocomplete="organization"
            maxlength="160"
          />
        </div>
      </div>

      <div class="field">
        <label for="enquiry-interest">What do you need? <span aria-hidden="true">*</span></label>
        <EnquiryInterestSelect
          v-model="form.interest"
          :options="content.interests"
          input-id="enquiry-interest"
          input-name="interest"
          required
        />
      </div>

      <div class="field">
        <label for="enquiry-message">Message <span aria-hidden="true">*</span></label>
        <textarea
          id="enquiry-message"
          v-model.trim="form.message"
          name="message"
          rows="7"
          minlength="10"
          maxlength="4000"
          aria-describedby="enquiry-message-hint"
          required
        />
        <p id="enquiry-message-hint" class="field-hint">
          Include useful details such as quantity, location or the service you require.
        </p>
      </div>

      <div class="honeypot" aria-hidden="true">
        <label for="enquiry-website">Website</label>
        <input
          id="enquiry-website"
          v-model="form.website"
          name="website"
          type="text"
          autocomplete="off"
          tabindex="-1"
        />
      </div>

      <label class="consent" for="enquiry-consent">
        <input id="enquiry-consent" v-model="form.consent" name="consent" type="checkbox" required />
        <span>{{ content.consentLabel }} <span aria-hidden="true">*</span></span>
      </label>

      <div class="form-footer">
        <button
          class="submit-button"
          type="submit"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
          data-cta-location="contact-form"
          :data-cta-intent="form.interest"
        >
          {{ submitLabel }}
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
          </svg>
        </button>

        <output id="enquiry-form-status" class="form-status" :data-state="submissionState" aria-live="polite">
          {{ statusMessage }}
        </output>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card {
  padding: clamp(28px, 5vw, 56px);
  border-radius: 24px;
  background: var(--surface);
  box-shadow: var(--shadow-border);
}

.form-heading {
  max-width: 650px;
  margin-bottom: 36px;
}

.form-heading .eyebrow {
  margin-bottom: 14px;
}

.form-heading h2 {
  margin-bottom: 16px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 4vw, 3.6rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}

.form-heading > p:last-child {
  margin-bottom: 0;
  color: var(--ink-muted);
  line-height: 1.7;
}

.enquiry-form {
  display: grid;
  gap: 24px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.field {
  display: grid;
  gap: 9px;
}

.field label {
  color: var(--brand-deep);
  font-size: 0.86rem;
  font-weight: 750;
}

.field label > span[aria-hidden='true'],
.consent span > span {
  color: var(--earth);
}

.optional {
  margin-left: 6px;
  color: var(--ink-muted);
  font-size: 0.72rem;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  min-height: 50px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--paper);
  color: var(--ink);
  transition-property: border-color, box-shadow, background-color;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.field textarea {
  min-height: 168px;
  resize: vertical;
}

.field input:hover,
.field textarea:hover {
  border-color: var(--leaf);
}

.field input:focus-visible,
.field textarea:focus-visible,
.consent input:focus-visible {
  outline: 3px solid var(--earth);
  outline-offset: 2px;
}

.field-hint {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.78rem;
}

.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.consent {
  display: grid;
  min-height: 44px;
  padding-block: 8px;
  align-items: start;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 12px;
  color: var(--ink-muted);
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.55;
}

.consent input {
  width: 20px;
  height: 20px;
  margin: 1px 0 0;
  accent-color: var(--brand-solid);
}

.form-footer {
  display: grid;
  align-items: center;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px 24px;
}

.submit-button {
  min-height: 50px;
  display: inline-flex;
  padding: 0 18px 0 20px;
  border: 0;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--brand-solid);
  color: var(--on-brand);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 800;
  transition-property: background-color, opacity, scale;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.submit-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.submit-button:hover:not(:disabled) {
  background: var(--brand);
}

.submit-button:active:not(:disabled) {
  scale: 0.96;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.68;
}

.form-status {
  min-height: 24px;
  display: block;
  color: var(--ink-muted);
  font-size: 0.86rem;
  line-height: 1.5;
}

.form-status[data-state='success'] {
  color: var(--brand-deep);
  font-weight: 700;
}

.form-status[data-state='error'] {
  color: var(--error);
  font-weight: 700;
}

@media (max-width: 680px) {
  .form-card {
    padding: 26px 20px;
    border-radius: 18px;
  }

  .field-grid,
  .form-footer {
    grid-template-columns: 1fr;
  }

  .submit-button {
    width: 100%;
  }
}
</style>

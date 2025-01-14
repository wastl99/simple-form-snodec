<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from '@vue/reactivity'
import type { Thread } from '@/types/Thread'
import { apiMockService } from '@/services/api.mock.service'
import ThreadItem from '@/components/ThreadItem.vue'
import { useRoute } from 'vue-router'
import type { Topic } from '@/types/Topic'
import BackButton from '@/components/BackButton.vue'
import NoEntryMessage from '@/components/NoEntryMessage.vue'
import CreatedInfo from '../components/CreatedInfo.vue'

const route = useRoute()
const topic = ref<Topic | null>(null)
const threads = ref<Thread[]>([])

onMounted(async () => {
  const topicUuid = Array.isArray(route.params.uuid) ? route.params.uuid[0] : route.params.uuid
  topic.value = await apiMockService.getTopicByUUID(topicUuid)
  threads.value = await apiMockService.getThreadsByTopicUUID(topicUuid)
})
</script>

<template>
  <h1 v-if="topic != null" class="heading flex-row gap-1">
    <div class="flex-col">
      <div class="heading-text">{{ topic.title }}</div>
      <div class="description">{{ topic.description }}</div>
      <CreatedInfo :user="topic.user" :created-at="topic.created_at" />
    </div>
    <div class="back-button">
      <BackButton route-to="/" label="All topics" />
    </div>
  </h1>
  <div v-if="threads.length > 0" class="threads">
    <ThreadItem v-for="thread in threads" :thread="thread" />
  </div>
  <NoEntryMessage v-else>Be the first to create a thread.</NoEntryMessage>
</template>

<style scoped lang="scss">
.heading {
  margin-block: 1em;
  align-items: flex-start;

  & .back-button {
    margin-top: 0.2em;
  }
}

.heading-text {
  line-height: 1em;
}

.description {
  font-size: 1rem;
  margin-block: 0;
}

.threads {
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
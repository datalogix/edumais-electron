<script setup lang="ts">
const router = useRouter()
const auth = useAuth()

await auth.logout()
await router.push({ name: 'login' })
</script>

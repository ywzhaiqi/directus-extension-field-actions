import { Ref, computed } from 'vue';
import { usePrefix } from './use-prefix';

function parseExpression(prefix: string, value: any, values: Record<string, any> | undefined, errorMsg: Ref<string | null>) {
  // values on display is undefined
  if (values && prefix.startsWith('return ')) {
    const keys = Object.keys(values);
    if (keys.length === 0) {
      errorMsg.value = null
      return value;
    }

    try {
      return new Function(...Object.keys(values), prefix)(...Object.values(values))
    } catch (e) {
      console.error('Error while parsing expression', e);
      errorMsg.value = (e as Error).message;
      return value;
    }
  } else {
    errorMsg.value = null
    return prefix + value;
  }
}

export function usePrefixedValues(props: any, values: Ref<Record<string, any>>, errorMsg: Ref<string | null>) {
  // TODO: make sure it's always a valid link (absolute + relative)

  const computedLink = computed(() => {
    const prefix = usePrefix(props.linkPrefix);
    return parseExpression(prefix.value, props.value, values?.value, errorMsg);
    // return prefix.value + props.value;
  });

  const computedCopyValue = computed(() => { 
    const prefix = usePrefix(props.copyPrefix);
    return parseExpression(prefix.value, props.value, values?.value, errorMsg);
    // return prefix.value + props.value;
  });

  return { computedLink, computedCopyValue };
}

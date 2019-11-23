import {Vue} from 'vue-property-decorator';
import {ElMessageComponent} from 'element-ui/types/message';

export default class Base extends Vue {

    protected showErrMsg(e: any, prefix?: string): ElMessageComponent {
        const msg = (prefix ? prefix + ' ' : '') + e;
        return this.$message({
            message: msg,
            type: 'error',
            offset: 150,
            showClose: true,
        });
    }
}

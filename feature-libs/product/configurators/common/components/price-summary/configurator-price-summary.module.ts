import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { ConfiguratorPriceSummaryComponent } from './configurator-price-summary.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, CommonModule, I18nModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        VariantConfigurationPriceSummary: {
          component: ConfiguratorPriceSummaryComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorPriceSummaryComponent],
  exports: [ConfiguratorPriceSummaryComponent],
  entryComponents: [ConfiguratorPriceSummaryComponent],
})
export class ConfiguratorPriceSummaryModule {}